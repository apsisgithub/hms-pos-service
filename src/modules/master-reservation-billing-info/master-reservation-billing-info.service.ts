import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { UpdateMasterReservationBillingInfoDto } from "./dto/update-master-reservation-billing-info.dto";
import { QueryManagerService } from "src/common/query-manager/query.service";
import { InjectRepository } from "@nestjs/typeorm";
import { ReservationBillingDetails } from "./entities/master-reservation-billing-info.entity";
import { DataSource, Repository } from "typeorm";
import { handleError } from "src/utils/handle-error.util";
import { getCurrentUser } from "src/common/utils/user.util";
import { GetReservationsBillingsDto } from "./dto/get-reservation-billing-info.dto";
import { paginationResponse } from "src/utils/pagination-response.util";
import { CreateReservationBillingDetailDto } from "./dto/create-master-reservation-billing-info.dto";
import { MasterEmailTemplate } from "../master-email-templates/entities/master_email_templates.entity";
import { ReservationRoom } from "../master-reservation/entities/master_reservation_room.entity";

@Injectable()
export class MasterReservationBillingInfoService {
    constructor(
        @Inject() private readonly queryService: QueryManagerService,
        @InjectRepository(ReservationBillingDetails)
        private readonly dataSource: DataSource,
        @InjectRepository(MasterEmailTemplate)
        private readonly emailTemplateRepo: Repository<MasterEmailTemplate>
    ) {}
    async create(dto: CreateReservationBillingDetailDto) {
        const transaction = await this.queryService.createTransaction();
        try {
            await transaction.startTransaction();

            const emailTemplateExists = await this.emailTemplateRepo.findOne({
                where: { id: dto.checkout_email_template_id },
            });

            if (!emailTemplateExists) {
                throw new NotFoundException(
                    "Checkout email template does not exist."
                );
            }

            const newReservationBillings = new ReservationBillingDetails();
            Object.assign(newReservationBillings, dto);

            if (dto.sources) {
                Object.assign(newReservationBillings, dto.sources);
            }
            newReservationBillings.created_by = Number(
                getCurrentUser("user_id")
            );

            const res = await transaction.save(
                ReservationBillingDetails,
                newReservationBillings
            );

            await transaction.commitTransaction();
            return res;
        } catch (error) {
            console.error("error in create-reservation: ", error);
            await transaction.rollbackTransaction();
            handleError(error);
        } finally {
            await transaction.release();
        }
    }

    async findAll(dto: GetReservationsBillingsDto) {
        try {
            const { page_number = 1, limit, reservation_id } = dto;

            const baseQuery = `
            SELECT 
                bd.*,
                rate.name AS rate_plan_package_name,
                g.name AS guest_name,
                res.reservation_number,
                temp.name AS email_template_name
            FROM 
                master_reservation_billing_details bd
            LEFT JOIN 
                master_rate_types rate
                ON bd.rate_plan_package_id = rate.id
            LEFT JOIN 
                master_reservation_guests rg 
                ON bd.reservation_id = rg.reservation_id
            LEFT JOIN 
                master_guests g 
                ON bd.guest_id = g.id
            LEFT JOIN
                master_reservations res
                ON rg.reservation_id = res.id
            LEFT JOIN
                master_email_templates temp
                ON bd.checkout_email_template_id = temp.id
            WHERE 
                bd.reservation_id = ?
            AND bd.deleted_at IS NULL
            ORDER BY 
                bd.id ASC
        `;

            const params: any[] = [reservation_id];

            if (limit === undefined || limit === null) {
                const result = await this.dataSource.query(baseQuery, params);
                return result;
            } else {
                const offset = (page_number - 1) * limit;

                const paginatedQuery = baseQuery + ` LIMIT ? OFFSET ?`;
                const paginatedParams = [...params, limit, offset];

                const [data, totalResult] = await Promise.all([
                    this.dataSource.query(paginatedQuery, paginatedParams),
                    this.dataSource.query(
                        `SELECT COUNT(*) as total FROM master_reservation_billing_details WHERE reservation_id = ?`,
                        [reservation_id]
                    ),
                ]);

                const total = parseInt(totalResult[0]?.total || 0, 10);

                return paginationResponse({
                    data,
                    total,
                    page: page_number,
                    limit,
                });
            }
        } catch (error) {
            console.error("error in find-all-reservation-billings: ", error);
            handleError(error, "while getting all reservation-billings");
        }
    }

    async findOne(id: number) {
        try {
            const baseQuery = `
            SELECT 
                bd.*,
                rate.name AS rate_plan_package_name,
                g.name AS guest_name,
                res.reservation_number,
                mode.name AS payment_mode,
                temp.name as email_template_name
            FROM 
                master_reservation_billing_details bd
            LEFT JOIN 
                master_rate_types rate ON bd.rate_plan_package_id = rate.id
            LEFT JOIN 
                master_reservation_guests rg ON bd.reservation_id = rg.reservation_id
            LEFT JOIN 
                master_guests g ON bd.guest_id = g.id
            LEFT JOIN 
                master_reservations res ON rg.reservation_id = res.id
            LEFT JOIN 
                master_payment_modes mode ON bd.payment_mode_id = mode.id
                 LEFT JOIN
                master_email_templates temp
                ON bd.checkout_email_template_id = temp.id
            WHERE 
                bd.id = ?
            AND bd.deleted_at IS NULL
        `;

            const params: any[] = [id];

            const result = await this.dataSource.query(baseQuery, params);

            if (result.length === 0) {
                throw new NotFoundException(
                    "Reservation billing was not found"
                );
            }

            return result[0];
        } catch (error) {
            console.error("Error in find-one-reservation-billings: ", error);
            handleError(error, "while getting reservation-billings");
        }
    }

    async update(id: number, dto: UpdateMasterReservationBillingInfoDto) {
        const transaction = await this.queryService.createTransaction();

        try {
            await transaction.startTransaction();

            const updatedBy = Number(getCurrentUser("user_id"));

            if (dto.reservation_id && dto.room_id && dto.rate_plan_package_id) {
                if (!dto.apply_to_group) {
                    await transaction.bulkUpdate(
                        ReservationRoom,
                        {
                            reservation_id: dto.reservation_id,
                            room_id: dto.room_id,
                        },
                        {
                            rate_type_id: dto.rate_plan_package_id,
                            updated_by: updatedBy,
                        }
                    );
                } else {
                    await transaction.bulkUpdate(
                        ReservationRoom,
                        { reservation_id: dto.reservation_id },
                        {
                            rate_type_id: dto.rate_plan_package_id,
                            updated_by: updatedBy,
                        }
                    );
                }
            }

            const updatedData = {
                rate_plan_package_details: dto.rate_plan_package_details,
                rate_plan_package_id: dto.rate_plan_package_id,
                updated_by: Number(getCurrentUser("user_id")),
                billing_type: dto.billing_type,
                payment_mode_id: dto.payment_mode_id,
                registration_no: dto.registration_no,
                reservation_type: dto.reservation_type,
                send_checkout_email: dto.send_checkout_email,
                checkout_email_template_id: dto.checkout_email_template_id,
                suppress_rate_on_gr_card: dto.suppress_rate_on_gr_card,
                display_inclusion_separately_on_folio:
                    dto.display_inclusion_separately_on_folio,
                apply_to_group: dto.apply_to_group,
            };

            if (dto.reservation_id) {
                const res = await transaction.bulkUpdate(
                    ReservationBillingDetails,
                    { reservation_id: dto.reservation_id },

                    updatedData
                );
            }

            const updatedReservation = await transaction.update(
                ReservationBillingDetails,
                { id },

                updatedData
            );

            await transaction.commitTransaction();

            return updatedReservation;
        } catch (error) {
            console.error("error in update-reservation-billings: ", error);
            await transaction.rollbackTransaction();
            handleError(error, "while updating reservation-billings");
        } finally {
            await transaction.release();
        }
    }

    async remove(reservation_billings_id: number) {
        const transaction = await this.queryService.createTransaction();

        try {
            await transaction.startTransaction();

            await transaction.softDelete(
                ReservationBillingDetails,
                { id: reservation_billings_id },
                {
                    deleted_by: Number(getCurrentUser("user_id")),
                }
            );

            await transaction.commitTransaction();

            return `reservation-billings was deleted successfully`;
        } catch (error) {
            console.error("error in remove-reservation-billings: ", error);
            await transaction.rollbackTransaction();
            handleError(error, "while deleting reservation-billings");
        } finally {
            await transaction.release();
        }
    }

    async getBillingDetails(reservation_id: number) {
        try {
            const baseQuery = `
            SELECT 
                br.*,
                et.name AS checkout_email_template_name,
                guest.name AS guest_name,
                mc.market_code_name ,
                bs.name AS business_source_name,
                ta.name AS travel_agent_name
            FROM master_reservation_billing_details br
            LEFT JOIN master_email_templates et 
                ON br.checkout_email_template_id = et.id
            LEFT JOIN master_market_code mc 
                ON br.market_code_id = mc.id
            LEFT JOIN master_business_sources bs 
                ON br.business_source_id = bs.id
            LEFT JOIN master_business_agents ta 
                ON br.travel_agent_id = ta.id
            LEFT JOIN master_guests guest 
                ON guest.id = br.guest_id
            WHERE br.reservation_id = ?
    `;

            const params: any[] = [reservation_id];

            const result = await this.dataSource.query(baseQuery, params);

            return result[0];
        } catch (error) {
            console.error("error in get-billing-details: ", error);
            handleError(error);
        }
    }

    // async updateStatus(id: number, status: string) {
    //     const transaction = await this.queryService.createTransaction();
    //     try {
    //         await transaction.startTransaction();

    //         const res = await transaction.update(
    //             reservation - billings,
    //             { id },
    //             { status }
    //         );

    //         await transaction.commitTransaction();

    //         return res;
    //     } catch (error) {
    //         console.error(
    //             "error in update-reservation-billings-status: ",
    //             error
    //         );
    //         await transaction.rollbackTransaction();
    //         handleError(error);
    //     } finally {
    //         await transaction.release();
    //     }
    // }
}
