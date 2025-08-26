import {
    ForbiddenException,
    Inject,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { CreateReservationDto } from "./dto/create-master-reservation.dto";
import { UpdateMasterReservationDto } from "./dto/update-master-reservation.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { QueryManagerService } from "src/common/query-manager/query.service";
import {
    PaymentStatus,
    Reservation,
    ReservationStatus,
} from "./entities/master_reservation.entity";
import { ReservationRoom } from "./entities/master_reservation_room.entity";
import { MasterReservationGuests } from "./entities/master_reservation_guests.entity";
import { MasterGuest } from "src/modules/master-guests/entities/master-guest.entity";
import { Repository, DataSource, In } from "typeorm";
import { QuickReservationDto } from "./dto/quick-reservation.dto";
import { getCurrentUser } from "src/common/utils/user.util";
import { handleError } from "src/utils/handle-error.util";
import {
    GetReservationDto,
    GetStatyviewReservationDto,
} from "./dto/get-reservations.dto";
import { paginationResponse } from "src/utils/pagination-response.util";
import { MasterRoomsService } from "src/modules/master-rooms/master-rooms.service";
import { RoomOccupancyStatus } from "src/modules/master-rooms/entities/master_room.entity";
import { MasterCreditCard } from "./entities/master_credit_card.entity";
import { ChargeCardDto } from "./dto/charge-card.dto";
import { GetCreditCardsDto } from "./dto/get-credit-cards.dto";
import { AddCardDto } from "./dto/add-card.dto";
import {
    MasterPayments,
    PaymentStatusTypes,
} from "./entities/master_payments.entity";
import { PaymentModes } from "../master-payment-modes/master-payment-modes.service";
import {
    ChargeRule,
    ChargeSubType,
    ChargeType,
    MasterCharges,
    PostingType,
} from "./entities/master_charges.entity";
import { CreateChargeDto } from "./dto/create-charge.dto";
import { UpdateChargeDto } from "./dto/update-charge.dto";
import { GetChargesDto } from "./dto/get-charges.dto";
import { GetFolioOperationsDto } from "./dto/get-folio-operations.dto";
import { CreateReservationSourceInfoDto } from "./dto/create-reservation-source-info.dto";
import { ReservationSourceInfo } from "./entities/master_reservation_source_info.entity";
import { GetReservationSourcesInfoDto } from "./dto/get-reservation-source-info.dto";
import { UpdateReservationSourceInfoDto } from "./dto/update-reservation-source-info.dto";
import { CreateRoomChargeDto } from "./dto/create-room-charge.dto";
import {
    MasterFolios,
    FolioType,
    FolioStatus,
} from "./entities/master_folios.entity";
import { MasterFolioDiscount } from "./entities/master_folio_discount.entity";
import { CreateFolioDto } from "./dto/create-folio.dto";
import { GetFoliosDto } from "./dto/get-folios.dto";
import { AddDiscountDto } from "./dto/add-discount.dto";
import { GetReservationRoomsDto } from "./dto/get-reservation-rooms.dto";
import { FindRoomChargesDto } from "./dto/find-room-charges.dto";
import { AssignRoomDto } from "./dto/assign-room.dto";
import { AuditLogService } from "../audit-log/audit-log.service";
import { CutFolioDto } from "./dto/cut-folio.dto";
import { SplitFolioDto } from "./dto/split-folio.dto";
import { CreatePaymentDto } from "./dto/create-payment.dto";
import { UpdateFolioDto } from "./dto/update-folio.dto";
import { TransferAmountDto } from "./dto/transfer-amount.dto";
import { StatusGraph } from "src/common/status-graph";
import { addTime, formatDateTime, getCurrentDate } from "src/utils/datetime";
import { MasterTaxesService } from "../master-taxes/master-taxes.service";
import { FoliosRoomsMapping } from "./entities/folios_rooms_mapping.entity";

import { MasterReservationBillingInfoModule } from "../master-reservation-billing-info/master-reservation-billing-info.module";
import {
    BillingType,
    ReservationBillingDetails,
    ReservationBookingType,
} from "../master-reservation-billing-info/entities/master-reservation-billing-info.entity";

const reservationStatusGraph = new StatusGraph({
    [ReservationStatus.PENDING]: [
        ReservationStatus.CONFIRMED,
        ReservationStatus.TENTATIVE,
        ReservationStatus.CANCELLED,
    ],
    [ReservationStatus.CONFIRMED]: [
        ReservationStatus.CHECKED_IN,
        ReservationStatus.CANCELLED,
    ],
    [ReservationStatus.CHECKED_IN]: [ReservationStatus.CHECKED_OUT],
    [ReservationStatus.CHECKED_OUT]: [],
});

@Injectable()
export class MasterReservationService {
    constructor(
        @Inject() private readonly queryService: QueryManagerService,
        @InjectRepository(Reservation)
        private readonly reservationRepo: Repository<Reservation>,
        @InjectRepository(ReservationRoom)
        private readonly reservationRoomRepo: Repository<ReservationRoom>,
        private readonly masterRoomsService: MasterRoomsService,
        @InjectRepository(ReservationSourceInfo)
        private readonly reservationSourceInfoRepo: Repository<ReservationSourceInfo>,

        @InjectRepository(MasterCreditCard)
        private readonly creditCardRepo: Repository<MasterCreditCard>,
        @InjectRepository(MasterCharges)
        private readonly chargesRepo: Repository<MasterCharges>,
        @InjectRepository(MasterPayments)
        private readonly paymentsRepo: Repository<MasterPayments>,
        @InjectRepository(MasterFolios)
        private readonly foliosRepo: Repository<MasterFolios>,
        @InjectRepository(MasterFolioDiscount)
        private readonly folioDiscountRepo: Repository<MasterFolioDiscount>,
        private readonly dataSource: DataSource,
        private readonly auditLogService: AuditLogService,
        private readonly taxService: MasterTaxesService
    ) {}

    /**
     * Generates the next folio number for a given SBU
     * @param sbu_id - The SBU ID for which to generate the folio number
     * @returns Promise<string> - The generated folio number in format "sbu_id_000001"
     */
    private async generateFolioNumber(sbu_id: number): Promise<string> {
        const existingFolios = await this.foliosRepo.find({
            where: { sbu_id },
            select: ["folio_no"],
            order: { id: "DESC" },
        });

        let nextNumber = 1;
        if (existingFolios.length > 0) {
            const numbers = existingFolios
                .map((folio) => {
                    const parts = folio.folio_no.split("_");
                    return parts.length === 2 ? parseInt(parts[1], 10) : 0;
                })
                .filter((num) => !isNaN(num));

            nextNumber = numbers.length > 0 ? Math.max(...numbers) + 1 : 1;
        }

        const paddedNumber = nextNumber.toString().padStart(6, "0");
        return `${sbu_id}_${paddedNumber}`;
    }

    async createFullReservation(dto: CreateReservationDto) {
        const transaction = await this.queryService.createTransaction();
        try {
            await transaction.startTransaction();

            const requestedRooms = dto.rooms.map((room) => room.room_id);

            const overlappingReservations = await this.reservationRepo
                .createQueryBuilder("reservation")
                .innerJoin("reservation.reservationRooms", "reservationRooms")
                .innerJoin("reservationRooms.room", "room")
                .where("reservationRooms.room_id IN (:...roomIds)", {
                    roomIds: requestedRooms,
                })
                .andWhere("reservation.status IN (:...statuses)", {
                    statuses: [
                        ReservationStatus.TENTATIVE,
                        ReservationStatus.CONFIRMED,
                        ReservationStatus.CHECKED_IN,
                    ],
                })
                .andWhere("reservation.sbu_id = :sbu_id", {
                    sbu_id: dto.sbu_id,
                })
                .andWhere("reservation.deleted_at IS NULL")
                .andWhere("reservationRooms.deleted_at IS NULL")
                .andWhere("room.deleted_at IS NULL")
                .andWhere(
                    "(reservation.check_in_datetime < :checkoutDate AND reservation.check_out_datetime > :checkinDate)",
                    {
                        checkinDate: dto.check_in_datetime,
                        checkoutDate: dto.check_out_datetime,
                    }
                )
                .select([
                    "reservation.id",
                    "reservation.reservation_number",
                    "reservation.status",
                    "reservation.check_in_datetime",
                    "reservation.check_out_datetime",
                    "reservationRooms.room_id",
                    "room.room_number",
                ])
                .getMany();

            console.log("overlapped-reservs: ", overlappingReservations);

            if (overlappingReservations.length > 0) {
                // Create a map of unique conflicting rooms with their details
                const conflictingRoomsMap = new Map();
                overlappingReservations.forEach((res) => {
                    res.reservationRooms.forEach((room) => {
                        if (!conflictingRoomsMap.has(room.room_id)) {
                            conflictingRoomsMap.set(room.room_id, {
                                room_id: room.room_id,
                                room_number: room.room?.room_number || "N/A",
                            });
                        }
                    });
                });

                const conflictingRooms = Array.from(
                    conflictingRoomsMap.values()
                );
                const roomDetails = conflictingRooms.map(
                    (room) => `${room.room_number} (ID: ${room.room_id})`
                );

                throw new ForbiddenException(
                    `Room(s) ${roomDetails.join(", ")} are already reserved during the requested dates. ` +
                        `Conflicting reservations: ${overlappingReservations.map((res) => res.reservation_number).join(", ")}`
                );
            }

            let guestId: number;

            if (dto.guest_details.guest_id) {
                guestId = dto.guest_details.guest_id;
            } else {
                // Create new guest
                const newGuest = new MasterGuest();
                newGuest.name = dto.guest_details.name;
                newGuest.email = dto.guest_details.email;
                newGuest.contact_no = dto.guest_details.phone ?? "";
                newGuest.company_name = dto.guest_details.company_name ?? "";
                newGuest.sbu_id = dto.sbu_id;

                newGuest.created_by = Number(getCurrentUser("user_id"));

                const savedGuest: any = await transaction.save(
                    MasterGuest,
                    newGuest
                );
                guestId = savedGuest.id;
            }

            const reservationNumber = `QR-${Date.now()}`;

            // Calculate totals
            const totalAdults = dto.rooms.reduce(
                (sum, room) => sum + room.adult_count,
                0
            );
            const totalChildren = dto.rooms.reduce(
                (sum, room) => sum + room.child_count,
                0
            );
            const totalRate = dto.rooms.reduce(
                (sum, room) => sum + room.rate,
                0
            );

            const newReservation = new Reservation();
            Object.assign(newReservation, dto);

            newReservation.reservation_number = reservationNumber;
            newReservation.check_in_datetime = new Date(dto.check_in_datetime);
            newReservation.check_out_datetime = new Date(
                dto.check_out_datetime
            );
            newReservation.total_adults = totalAdults;
            newReservation.total_children = totalChildren;
            newReservation.total_calculated_rate = totalRate;
            newReservation.status = ReservationStatus.CONFIRMED;
            newReservation.payment_status = PaymentStatus.PENDING;
            newReservation.reservation_date = new Date();
            newReservation.created_by = Number(getCurrentUser("user_id"));

            newReservation.sbu_id = dto.sbu_id;

            const res = (await transaction.save(
                Reservation,
                newReservation
            )) as Reservation;

            const reservationGuestList = dto.rooms.map((roomId) => ({
                reservation_id: res.id,
                guest_id: guestId,
                room_id: roomId.room_id,
                is_master_guest: true,
                created_by: Number(getCurrentUser("user_id")),
            }));

            await transaction.bulkInsert(
                MasterReservationGuests,
                reservationGuestList
            );

            for (const roomData of dto.rooms) {
                await this.masterRoomsService.updateRoomWithTransaction(
                    roomData.room_id,
                    {
                        status: RoomOccupancyStatus.Occupied,
                    },
                    transaction
                );
            }

            const folioNo = await this.generateFolioNumber(dto.sbu_id);

            const defaultFolio = new MasterFolios();
            defaultFolio.folio_no = folioNo;
            defaultFolio.guest_id = guestId;
            defaultFolio.sbu_id = dto.sbu_id;
            defaultFolio.folio_type = FolioType.GUEST;
            defaultFolio.reservation_id = res.id;
            defaultFolio.created_by = Number(getCurrentUser("user_id"));

            const folio = (await transaction.save(
                MasterFolios,
                defaultFolio
            )) as MasterFolios;

            const reservationRooms: any = [];
            for (const roomData of dto.rooms) {
                const reservationRoom = new ReservationRoom();
                reservationRoom.reservation_id = res.id;
                reservationRoom.folio_id = folio.id;
                reservationRoom.room_id = roomData.room_id;
                reservationRoom.adults_in_room = roomData.adult_count;
                reservationRoom.children_in_room = roomData.child_count;
                reservationRoom.room_rate = roomData.rate;
                reservationRoom.created_by = Number(getCurrentUser("user_id"));

                reservationRoom.room_type_id = roomData.room_type_id;
                reservationRoom.rate_type_id = roomData.rate_type_id;
                reservationRoom.is_assigned = roomData.is_assigned;

                reservationRooms.push(reservationRoom);
            }

            await transaction.save(ReservationRoom, reservationRooms);

            const maxRefNo = await this.chargesRepo
                .createQueryBuilder("charge")
                .select("MAX(charge.ref_no)", "maxRefNo")
                .where("charge.sbu_id = :sbu_id", { sbu_id: dto.sbu_id })
                .getRawOne();

            const nextRefNo = (maxRefNo?.maxRefNo || 0) + 1;

            const chargesList = dto.rooms.map((room) => ({
                room_id: room.room_id,
                amount: room.rate,
                folio_id: folio.id,
                description: "Room Charge",
                ref_no: nextRefNo,
                posting_type: PostingType.EVERY_DAY,
                charge_rule: ChargeRule.PER_BOOKING,
                is_tax_included: true,
                sbu_id: dto.sbu_id,
                type: ChargeType.ROOM_CHARGES,
                sub_type: ChargeSubType.ROOM_CHARGES,
                charge_date: getCurrentDate(),
                created_by: Number(getCurrentUser("user_id")),
            }));

            await transaction.bulkInsert(MasterCharges, chargesList);

            const folioRoomsMapping = dto.rooms.map((roomData) => {
                const mapping = new FoliosRoomsMapping();
                (mapping.folio_id = folio.id),
                    (mapping.reservation_id = res.id),
                    (mapping.room_id = roomData.room_id);

                return mapping;
            });

            await transaction.bulkInsert(FoliosRoomsMapping, folioRoomsMapping);

            let credit_card_id = dto.payments.credit_card?.credit_card_id;
            if (!credit_card_id) {
                if (dto.payments.credit_card?.card_holder_name) {
                    const newCreditCard = new MasterCreditCard();
                    Object.assign(newCreditCard, dto.payments);

                    (newCreditCard.reservation_id = res.id),
                        (newCreditCard.sbu_id = dto.sbu_id);
                    (newCreditCard.card_holder_name =
                        dto.payments.credit_card.card_holder_name),
                        (newCreditCard.card_number =
                            dto.payments.credit_card.card_number),
                        (newCreditCard.expiry_month =
                            dto.payments.credit_card.expiry_month);
                    newCreditCard.expiry_year =
                        dto.payments.credit_card.expiry_year;
                    (newCreditCard.cvv = dto.payments.credit_card.cvv
                        ? dto.payments.credit_card.cvv
                        : 0),
                        (newCreditCard.card_type =
                            dto.payments.credit_card.card_type);
                    newCreditCard.created_by = Number(
                        getCurrentUser("user_id")
                    );

                    const card: any = await transaction.save(
                        MasterCreditCard,
                        newCreditCard
                    );

                    credit_card_id = card.id;
                }
            }

            // Generate ref_no for payment by finding the maximum existing ref_no and incrementing it
            const maxPaymentRefNo = await this.paymentsRepo
                .createQueryBuilder("payment")
                .select("MAX(payment.ref_no)", "maxRefNo")
                .where("payment.sbu_id = :sbu_id", { sbu_id: dto.sbu_id })
                .getRawOne();

            const nextPaymentRefNo = (maxPaymentRefNo?.maxRefNo || 0) + 1;

            await transaction.save(MasterPayments, {
                ref_no: nextPaymentRefNo,
                sbu_id: dto.sbu_id,
                folio_id: folio.id,
                paid_amount: dto.payments.amount,
                payment_mode_id: dto.payments.payment_mode_id,
                payment_status: PaymentStatusTypes.Paid,
                paid_date: new Date(),
                created_by: Number(getCurrentUser("user_id")),
                currency_id: dto.currency_id,
                description: `Payment for reservation ${res.id}`,
            });

            // Log folio creation and payment
            await this.auditLogService.logFolioOperation(
                res.id,
                dto.sbu_id,
                "FOLIO_CREATED",
                { title: "Reservation Created" },
                {
                    title: "Folio Created",
                    description: `Folio ${folioNo} created for reservation ${res.reservation_number}`,
                }
            );

            await transaction.save(ReservationBillingDetails, {
                reservation_id: res.id,
                billing_type: BillingType.CASH_BANK,
                payment_mode_id: dto.payments.payment_mode_id,
                registration_no: res.reservation_number,
                reservation_type: ReservationBookingType.CONFIRM_BOOKING,
                rate_plan_package_id: dto.rooms[0].rate_type_id,
                guest_id: guestId,
                send_checkout_email: 0,
                suppress_rate_on_gr_card: 0,
                display_inclusion_separately_on_folio: 0,
                apply_to_group: 0,
                commission_plan: "Confirm Booking",
            });

            await this.auditLogService.logPaymentOperation(
                res.id,
                dto.sbu_id,
                dto.charge_amount,
                "Online",
                folioNo
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

    async findAll(dto: GetReservationDto) {
        try {
            const { page_number = 1, limit } = dto;

            if (limit === undefined || limit === null) {
                const reservationList = await this.reservationRepo.find({
                    order: {
                        id: "ASC",
                    },
                });

                return reservationList;
            } else {
                const [reservationList, total] =
                    await this.reservationRepo.findAndCount({
                        skip: (page_number - 1) * limit,
                        take: limit,
                        order: {
                            id: "ASC",
                        },
                    });

                return paginationResponse({
                    data: reservationList,
                    total,
                    page: page_number,
                    limit,
                });
            }
        } catch (error) {
            console.error("error in find-all-building: ", error);
            handleError(error, "while getting all building");
        }
    }

    async findOne(id: number) {
        try {
            const reservationResult = await this.reservationRepo.query(
                `
            SELECT
                r.id,
                r.created_at,
                r.created_by,
                r.updated_at,
                r.updated_by,
                r.deleted_at,
                r.deleted_by,
                r.reservation_number,
                r.sbu_id,
                r.business_agent_id,
                r.total_adults,
                r.total_children,
                r.payment_currency_choice,
                r.total_calculated_rate,
                r.exchange_rate_show,
                r.extra_bed_required,
                r.split_reservation_flag,
                r.pickup_drop_required,
                r.pickup_drop_time,
                r.send_email_at_checkout,
                r.email_booking_vouchers,
                r.display_inclusion_separately_on_folio,
                r.is_rate_includes_taxes,
                r.is_day_use,
                r.status,
                r.rate_type,
                r.payment_status,
                r.payment_mode_id,
                r.business_source_id,
                r.advance_paid_amount,
                r.check_in_datetime,
                r.check_out_datetime,
                r.reservation_date,
                r.booking_source,
                r.channel_name,
                r.reservation_source_reference,
                r.booking_purpose,
                r.special_requests,
                r.cancelled_by,
                r.cancelled_at,
                r.cancellation_reason,
                mg.company_name as guest_company
            FROM master_reservations r
            LEFT JOIN master_reservation_billing_details mrb ON mrb.reservation_id = r.id
            LEFT JOIN master_reservation_guests mrg ON mrg.reservation_id = r.id
            LEFT JOIN master_guests mg ON mg.id = mrg.guest_id
            WHERE r.id = ?
            LIMIT 1;
            `,
                [id]
            );

            if (!reservationResult.length) {
                throw new NotFoundException("Reservation was not found");
            }

            const reservation = reservationResult[0];

            // Fetch rooms for the reservation
            const rooms = await this.reservationRepo.query(
                `
            SELECT
                mr.room_number AS room_name,
                mr.room_code,
                mrt.name AS room_type_name,
                rat.name AS rate_type_name
            FROM reservation_rooms rr
            LEFT JOIN master_rooms mr ON mr.id = rr.room_id
            LEFT JOIN master_room_types mrt ON mrt.id = mr.room_type_id
            LEFT JOIN master_rate_types rat ON rat.id = rr.rate_type_id
            WHERE rr.reservation_id = ?;
            `,
                [id]
            );

            reservation.rooms = rooms;

            return reservation;
        } catch (error) {
            console.error("Error in findOne:", error);
            throw error;
        }
    }

    async update(id: number, dto: UpdateMasterReservationDto) {
        const transaction = await this.queryService.createTransaction();

        try {
            await transaction.startTransaction();

            const updatedReservation = await transaction.update(
                Reservation,
                { id },
                {
                    ...dto,
                    updated_by: Number(getCurrentUser("user_id")),
                }
            );

            await transaction.commitTransaction();

            return updatedReservation;
        } catch (error) {
            console.error("error in update-reservation: ", error);
            await transaction.rollbackTransaction();
            handleError(error, "while updating reservation");
        } finally {
            await transaction.release();
        }
    }

    async remove(reservation_id: number) {
        const transaction = await this.queryService.createTransaction();

        try {
            await transaction.startTransaction();

            await transaction.softDelete(
                Reservation,
                { id: reservation_id },
                {
                    deleted_by: Number(getCurrentUser("user_id")),
                }
            );

            await transaction.commitTransaction();

            return `reservation was deleted successfully`;
        } catch (error) {
            console.error("error in remove-reservation: ", error);
            await transaction.rollbackTransaction();
            handleError(error, "while deleting reservation");
        } finally {
            await transaction.release();
        }
    }

    async updateStatus(id: number, status: ReservationStatus) {
        const transaction = await this.queryService.createTransaction();
        try {
            await transaction.startTransaction();

            // Get current reservation details for audit logging
            const reservation = await this.reservationRepo.findOne({
                where: { id },
                select: ["id", "status", "sbu_id", "reservation_number"],
            });

            if (!reservation) {
                throw new NotFoundException("Reservation not found");
            }

            const current_status = reservation.status;
            const allowed = reservationStatusGraph.canTransition(
                current_status,
                status
            );

            if (!allowed) {
                throw new ForbiddenException(
                    `You can not make the reservation status to ${status}. It is already in ${current_status} status`
                );
            }

            const res = await transaction.update(
                Reservation,
                { id },
                { status }
            );

            if (status === ReservationStatus.CHECKED_OUT) {
                const { rooms } = await this.getReservationRooms({
                    reservation_id: id,
                });
                for (const roomData of rooms) {
                    await this.masterRoomsService.updateRoomWithTransaction(
                        roomData.room_id,
                        {
                            status: RoomOccupancyStatus.Available,
                        },
                        transaction
                    );
                }
            }

            // Log the status update operation
            await this.auditLogService.logStatusUpdateOperation(
                id,
                reservation.sbu_id,
                current_status,
                status,
                reservation.reservation_number
            );

            await transaction.commitTransaction();

            return res;
        } catch (error) {
            console.error("error in update-reservation-status: ", error);
            await transaction.rollbackTransaction();
            handleError(error);
        } finally {
            await transaction.release();
        }
    }

    async getStayviewBookingDashboard(dto: GetStatyviewReservationDto) {
        try {
            const now = new Date();
            const currentYear = now.getFullYear();
            const currentMonth = now.getMonth();

            const monthStart = new Date(currentYear, currentMonth, 1);

            const monthEnd = new Date(
                currentYear,
                currentMonth + 1,
                0,
                23,
                59,
                59,
                999
            );

            const reservationList = await this.reservationRepo
                .createQueryBuilder("reservation")
                .leftJoinAndSelect(
                    "reservation.reservationGuests",
                    "reservationGuests"
                )
                .leftJoinAndSelect("reservationGuests.guest", "guest")
                .leftJoinAndSelect(
                    "reservation.reservationRooms",
                    "reservationRooms"
                )
                .leftJoinAndSelect("reservationRooms.room", "room")
                .leftJoinAndSelect("reservationRooms.roomType", "roomType")
                .leftJoinAndSelect("reservationRooms.rateType", "rateType")
                .where("reservation.status = :status", { status: "Confirmed" })
                .andWhere("reservation.sbu_id = :sbu_id", {
                    sbu_id: dto.sbu_id,
                })
                .andWhere("reservation.check_in_datetime >= :monthStart", {
                    monthStart,
                })
                .andWhere("reservation.check_in_datetime <= :monthEnd", {
                    monthEnd,
                })
                .orderBy("reservation.id", "ASC")
                .getMany();

            return {
                total: reservationList.length,
                reservationList,
            };
        } catch (error) {
            console.error("error in get-stayview-booking-dashboard: ", error);
            handleError(error, "while getting stayview booking dashboard");
        }
    }

    async quickReservation(dto: QuickReservationDto) {
        const transaction = await this.queryService.createTransaction();
        try {
            await transaction.startTransaction();

            const currentUserId = Number(getCurrentUser("user_id"));

            const requestedRoomIds = dto.rooms.map((room) => room.room_id);

            // Format dates properly for database comparison
            // If date is just YYYY-MM-DD, add time component
            const checkinDate = dto.checkin_date.includes(" ")
                ? dto.checkin_date
                : `${dto.checkin_date} 06:00:00`;
            const checkoutDate = dto.checkout_date.includes(" ")
                ? dto.checkout_date
                : `${dto.checkout_date} 06:00:00`;

            const overlappingReservations = await this.reservationRepo
                .createQueryBuilder("reservation")
                .innerJoin("reservation.reservationRooms", "reservationRooms")
                .innerJoin("reservationRooms.room", "room")
                .where("reservationRooms.room_id IN (:...roomIds)", {
                    roomIds: requestedRoomIds,
                })
                .andWhere("reservation.status IN (:...statuses)", {
                    statuses: [
                        ReservationStatus.TENTATIVE,
                        ReservationStatus.CONFIRMED,
                        ReservationStatus.CHECKED_IN,
                    ],
                })
                .andWhere("reservation.sbu_id = :sbu_id", {
                    sbu_id: dto.sbu_id,
                })
                .andWhere("reservation.deleted_at IS NULL")
                .andWhere("reservationRooms.deleted_at IS NULL")
                .andWhere("room.deleted_at IS NULL")
                .andWhere(
                    "(reservation.check_in_datetime < :checkoutDate AND reservation.check_out_datetime > :checkinDate)",
                    { checkinDate, checkoutDate }
                )
                .select([
                    "reservation.id",
                    "reservation.reservation_number",
                    "reservation.status",
                    "reservation.check_in_datetime",
                    "reservation.check_out_datetime",
                    "reservationRooms.room_id",
                    "room.room_number",
                ])
                .getMany();

            console.log("overlappingReservations:", overlappingReservations);

            if (overlappingReservations.length > 0) {
                // Create a map of unique conflicting rooms with their details
                const conflictingRoomsMap = new Map();
                overlappingReservations.forEach((res) => {
                    res.reservationRooms.forEach((room) => {
                        if (!conflictingRoomsMap.has(room.room_id)) {
                            conflictingRoomsMap.set(room.room_id, {
                                room_id: room.room_id,
                                room_number: room.room?.room_number || "N/A",
                            });
                        }
                    });
                });

                const conflictingRooms = Array.from(
                    conflictingRoomsMap.values()
                );
                const roomDetails = conflictingRooms.map(
                    (room) => `${room.room_number} (ID: ${room.room_id})`
                );

                throw new ForbiddenException(
                    `Room(s) ${roomDetails.join(", ")} are already reserved during the requested dates. ` +
                        `Conflicting reservations: ${overlappingReservations.map((res) => res.reservation_number).join(", ")}`
                );
            }

            let guestId: number;

            if (dto.guest_details.guest_id) {
                guestId = dto.guest_details.guest_id;
            } else {
                // Create new guest
                const newGuest = new MasterGuest();
                newGuest.name = dto.guest_details.name;
                newGuest.email = dto.guest_details.email
                    ? dto.guest_details.email
                    : "";
                newGuest.contact_no = dto.guest_details.mobile_no
                    ? dto.guest_details.mobile_no
                    : "";
                newGuest.company_name = dto.guest_details.company_name
                    ? dto.guest_details.company_name
                    : "";
                newGuest.sbu_id = dto.sbu_id;
                newGuest.created_by = currentUserId;

                const savedGuest: any = await transaction.save(
                    MasterGuest,
                    newGuest
                );
                guestId = savedGuest.id;
            }

            // Generate reservation number (you may want to implement a proper numbering system)
            const reservationNumber = `QR-${Date.now()}`;

            // Calculate totals
            const totalAdults = dto.rooms.reduce(
                (sum, room) => sum + room.adult_count,
                0
            );
            const totalChildren = dto.rooms.reduce(
                (sum, room) => sum + room.child_count,
                0
            );
            const totalRate = dto.rooms.reduce(
                (sum, room) => sum + room.rate,
                0
            );

            // Create reservation
            const newReservation = new Reservation();
            newReservation.reservation_number = reservationNumber;
            newReservation.check_in_datetime = new Date(dto.checkin_date);
            newReservation.check_out_datetime = new Date(dto.checkout_date);
            newReservation.payment_mode_id = dto.payment_mode_id;
            newReservation.business_source_id = dto.business_source_id;
            newReservation.total_adults = totalAdults;
            newReservation.total_children = totalChildren;
            newReservation.total_calculated_rate = totalRate;
            newReservation.status = ReservationStatus.CONFIRMED;
            newReservation.payment_status = PaymentStatus.PENDING;
            newReservation.reservation_date = new Date();
            newReservation.created_by = currentUserId;

            // Set default values for required fields
            newReservation.sbu_id = dto.sbu_id; // You may want to get this from context or make it configurable

            const savedReservation: any = await transaction.save(
                Reservation,
                newReservation
            );

            const reservationGuestList = dto.rooms.map((roomId) => ({
                reservation_id: savedReservation.id,
                guest_id: guestId,
                room_id: roomId.room_id,
                is_master_guest: true,
                created_by: currentUserId,
            }));

            await transaction.bulkInsert(
                MasterReservationGuests,
                reservationGuestList
            );

            // Create default folio for the reservation
            const folioNo = await this.generateFolioNumber(dto.sbu_id);

            const defaultFolio = new MasterFolios();
            defaultFolio.folio_no = folioNo;
            defaultFolio.guest_id = guestId;
            defaultFolio.sbu_id = dto.sbu_id;
            defaultFolio.folio_type = FolioType.GUEST;
            defaultFolio.reservation_id = savedReservation.id;
            defaultFolio.created_by = currentUserId;

            const folio = (await transaction.save(
                MasterFolios,
                defaultFolio
            )) as MasterFolios;

            // Create reservation-guest relationship
            /* const reservationGuest = new MasterReservationGuests();
            reservationGuest.reservation_id = savedReservation.id;
            reservationGuest.guest_id = guestId;
            reservationGuest.created_by = currentUserId;

            await transaction.save(MasterReservationGuests, reservationGuest);
            */

            const reservationRooms: any = [];
            for (const roomData of dto.rooms) {
                const reservationRoom = new ReservationRoom();
                reservationRoom.reservation_id = savedReservation.id;
                reservationRoom.room_id = roomData.room_id;
                reservationRoom.adults_in_room = roomData.adult_count;
                reservationRoom.children_in_room = roomData.child_count;
                reservationRoom.room_rate = roomData.rate;
                reservationRoom.created_by = currentUserId;

                reservationRoom.room_type_id = roomData.room_type_id;
                reservationRoom.rate_type_id = roomData.rate_type_id;
                reservationRoom.is_assigned = roomData.is_assigned;

                reservationRooms.push(reservationRoom);
            }

            await transaction.save(ReservationRoom, reservationRooms);

            const folioRoomsMapping = dto.rooms.map((roomData) => {
                const mapping = new FoliosRoomsMapping();
                (mapping.folio_id = folio.id),
                    (mapping.reservation_id = savedReservation.id),
                    (mapping.room_id = roomData.room_id);

                return mapping;
            });

            await transaction.bulkInsert(FoliosRoomsMapping, folioRoomsMapping);

            const maxRefNo = await this.chargesRepo
                .createQueryBuilder("charge")
                .select("MAX(charge.ref_no)", "maxRefNo")
                .where("charge.sbu_id = :sbu_id", { sbu_id: dto.sbu_id })
                .getRawOne();

            const nextRefNo = (maxRefNo?.maxRefNo || 0) + 1;

            const chargesList = dto.rooms.map((room) => ({
                room_id: room.room_id,
                amount: room.rate,
                folio_id: folio.id,
                description: "Room Charge",
                ref_no: nextRefNo,
                posting_type: PostingType.EVERY_DAY,
                charge_rule: ChargeRule.PER_BOOKING,
                is_tax_included: true,
                sbu_id: dto.sbu_id,
                type: ChargeType.ROOM_CHARGES,
                sub_type: ChargeSubType.ROOM_CHARGES,
                charge_date: getCurrentDate(),
                created_by: Number(getCurrentUser("user_id")),
            }));

            await transaction.bulkInsert(MasterCharges, chargesList);

            // Update room statuses to occupied
            for (const roomData of dto.rooms) {
                await this.masterRoomsService.updateRoomWithTransaction(
                    roomData.room_id,
                    {
                        status: RoomOccupancyStatus.Occupied,
                    },
                    transaction
                );
            }

            await transaction.save(ReservationBillingDetails, {
                reservation_id: savedReservation.id,
                billing_type: BillingType.CASH_BANK,
                payment_mode_id: dto.payment_mode_id,
                registration_no: savedReservation.reservation_number,
                reservation_type: ReservationBookingType.CONFIRM_BOOKING,
                rate_plan_package_id: dto.rooms[0].rate_type_id,
                guest_id: guestId,
                send_checkout_email: 0,
                suppress_rate_on_gr_card: 0,
                display_inclusion_separately_on_folio: 0,
                apply_to_group: 0,
                commission_plan: "Confirm Booking",
            });

            await transaction.commitTransaction();

            return {
                message: "Quick reservation created successfully",
                reservation_id: savedReservation.id,
                reservation_number: savedReservation.reservation_number,
                guest_id: guestId,
            };
        } catch (error) {
            console.error("error in quick-reservation: ", error);
            await transaction.rollbackTransaction();
            handleError(error, "while creating quick reservation");
        } finally {
            await transaction.release();
        }
    }

    async getStatusWiseMasterRoomCount(sbu_id?: number) {
        try {
            let roomStatusQuery = `
                SELECT 
                    status,
                    COUNT(*) as room_count
                FROM master_rooms 
                WHERE deleted_at IS NULL
            `;

            const roomStatusParams: any[] = [];

            if (sbu_id) {
                roomStatusQuery += ` AND sbu_id = ?`;
                roomStatusParams.push(sbu_id);
            }

            roomStatusQuery += `
                GROUP BY status
                ORDER BY status ASC
            `;

            let assignmentStatusQuery = `
                SELECT 
                    CASE 
                        WHEN is_assigned = 1 THEN 'assigned'
                        ELSE 'unassigned'
                    END as status,
                    COUNT(*) as room_count
                FROM reservation_rooms rr
                INNER JOIN master_reservations mr ON rr.reservation_id = mr.id
                WHERE rr.deleted_at IS NULL 
                AND mr.deleted_at IS NULL
                AND mr.status IN ( 'Tentative', 'Confirmed', 'CheckedIn' )
            `;

            const assignmentStatusParams: any[] = [];

            if (sbu_id) {
                assignmentStatusQuery += ` AND mr.sbu_id = ?`;
                assignmentStatusParams.push(sbu_id);
            }

            assignmentStatusQuery += `
                GROUP BY is_assigned
                ORDER BY is_assigned DESC
            `;

            // Execute both queries
            const [roomStatusResult, assignmentStatusResult] =
                await Promise.all([
                    this.dataSource.query(roomStatusQuery, roomStatusParams),
                    this.dataSource.query(
                        assignmentStatusQuery,
                        assignmentStatusParams
                    ),
                ]);

            const combinedResult = [
                ...roomStatusResult,
                ...assignmentStatusResult,
            ];

            return combinedResult;
        } catch (error) {
            console.error(
                "error in get-status-wise-master-room-count: ",
                error
            );
            handleError(error, "while getting status wise master room count");
        }
    }

    async getStatusWiseSingleReservationRoomCount(
        sbu_id: number,
        reservation_id: number
    ) {
        try {
            // Modified roomStatusQuery to join master_rooms with reservation_rooms and filter by reservation_id
            let roomStatusQuery = `
                SELECT 
                    mr.status,
                    COUNT(*) as room_count
                FROM master_rooms mr
                INNER JOIN reservation_rooms rr ON mr.id = rr.room_id
                INNER JOIN master_reservations res ON rr.reservation_id = res.id
                WHERE mr.deleted_at IS NULL 
                AND rr.deleted_at IS NULL 
                AND res.deleted_at IS NULL
                AND rr.reservation_id = ?
            `;

            const roomStatusParams: any[] = [reservation_id];

            if (sbu_id) {
                roomStatusQuery += ` AND mr.sbu_id = ?`;
                roomStatusParams.push(sbu_id);
            }

            roomStatusQuery += `
                GROUP BY mr.status
                ORDER BY mr.status ASC
            `;

            let assignmentStatusQuery = `
                SELECT 
                    CASE 
                        WHEN rr.is_assigned = 1 THEN 'assigned'
                        ELSE 'unassigned'
                    END as status,
                    COUNT(*) as room_count
                FROM reservation_rooms rr
                INNER JOIN master_reservations mr ON rr.reservation_id = mr.id
                WHERE rr.deleted_at IS NULL 
                AND mr.deleted_at IS NULL
                AND rr.reservation_id = ?
                AND mr.status IN ('Tentative', 'Confirmed', 'CheckedIn')
            `;

            const assignmentStatusParams: any[] = [reservation_id];

            if (sbu_id) {
                assignmentStatusQuery += ` AND mr.sbu_id = ?`;
                assignmentStatusParams.push(sbu_id);
            }

            assignmentStatusQuery += `
                GROUP BY rr.is_assigned
                ORDER BY rr.is_assigned DESC
            `;

            // Execute both queries
            const [roomStatusResult, assignmentStatusResult] =
                await Promise.all([
                    this.dataSource.query(roomStatusQuery, roomStatusParams),
                    this.dataSource.query(
                        assignmentStatusQuery,
                        assignmentStatusParams
                    ),
                ]);

            const combinedResult = [
                ...roomStatusResult,
                ...assignmentStatusResult,
            ];

            return combinedResult;
        } catch (error) {
            console.error(
                "error in get-status-wise-single-reservation-room-count: ",
                error
            );
            handleError(
                error,
                "while getting status wise single reservation room count"
            );
        }
    }

    // Credit Card Methods
    async addCard(dto: AddCardDto) {
        const transaction = await this.queryService.createTransaction();
        try {
            await transaction.startTransaction();

            // Verify reservation exists
            const reservation = await this.reservationRepo.findOne({
                where: { id: dto.reservation_id },
            });
            if (!reservation) {
                throw new NotFoundException("Reservation not found");
            }

            const newCreditCard = new MasterCreditCard();
            Object.assign(newCreditCard, dto);
            newCreditCard.created_by = Number(getCurrentUser("user_id"));

            const res = await transaction.save(MasterCreditCard, newCreditCard);

            await transaction.commitTransaction();
            return res;
        } catch (error) {
            console.error("error in add-card: ", error);
            await transaction.rollbackTransaction();
            handleError(error);
        } finally {
            await transaction.release();
        }
    }

    async applyPayment(dto: ChargeCardDto) {
        const transaction = await this.queryService.createTransaction();
        try {
            await transaction.startTransaction();

            let credit_card_id = dto.credit_card_id;
            if (!credit_card_id) {
                const newCreditCard = new MasterCreditCard();
                Object.assign(newCreditCard, dto);
                newCreditCard.created_by = Number(getCurrentUser("user_id"));

                const res: any = await transaction.save(
                    MasterCreditCard,
                    newCreditCard
                );

                credit_card_id = res.id;
            }

            // Generate ref_no for payment by finding the maximum existing ref_no and incrementing it
            const maxPaymentRefNo = await this.paymentsRepo
                .createQueryBuilder("payment")
                .select("MAX(payment.ref_no)", "maxRefNo")
                .where("payment.sbu_id = :sbu_id", { sbu_id: dto.sbu_id })
                .getRawOne();

            const nextPaymentRefNo = (maxPaymentRefNo?.maxRefNo || 0) + 1;

            await transaction.save(MasterPayments, {
                ref_no: nextPaymentRefNo,
                sbu_id: dto.sbu_id,
                folio_id: dto.folio_id,
                paid_amount: dto.charge_amount,
                payment_mode_id: PaymentModes.Online,
                payment_status: PaymentStatusTypes.Paid,
                paid_date: new Date(),
                created_by: Number(getCurrentUser("user_id")),
                currency_id: dto.currency_id,
                description: `Payment for reservation ${dto.reservation_id}`,
            });

            await transaction.commitTransaction();

            return {
                message: "Card charged successfully",
            };
        } catch (error) {
            console.error("error in charge-card: ", error);
            await transaction.rollbackTransaction();
            handleError(error);
        } finally {
            await transaction.release();
        }
    }

    async findAllCreditCards(dto: GetCreditCardsDto) {
        try {
            const { page_number = 1, limit, reservation_id, sbu_id } = dto;

            console.log("reservation_id:", reservation_id);

            const queryBuilder = this.creditCardRepo
                .createQueryBuilder("creditCard")
                .leftJoinAndSelect("creditCard.sbu", "sbu")
                .leftJoinAndSelect("creditCard.reservation", "reservation");
            // .leftJoinAndSelect("creditCard.currency", "currency");

            if (sbu_id) {
                queryBuilder.where("creditCard.sbu_id = :sbu_id", { sbu_id });
            }

            if (reservation_id) {
                if (sbu_id) {
                    queryBuilder.andWhere(
                        "creditCard.reservation_id = :reservation_id",
                        { reservation_id }
                    );
                } else {
                    queryBuilder.where(
                        "creditCard.reservation_id = :reservation_id",
                        { reservation_id }
                    );
                }
            }

            queryBuilder.orderBy("creditCard.id", "ASC");

            if (limit === undefined || limit === null) {
                const creditCardList = await queryBuilder.getMany();
                return creditCardList;
            } else {
                const [creditCardList, total] = await queryBuilder
                    .skip((page_number - 1) * limit)
                    .take(limit)
                    .getManyAndCount();

                return paginationResponse({
                    data: creditCardList,
                    total,
                    page: page_number,
                    limit,
                });
            }
        } catch (error) {
            console.error("error in find-all-credit-cards: ", error);
            handleError(error, "while getting all credit cards");
        }
    }

    async findOneCreditCard(id: number) {
        try {
            const creditCard = await this.creditCardRepo.findOne({
                where: { id },
                relations: ["sbu", "reservation", "currency"],
            });
            if (!creditCard) {
                throw new NotFoundException("Credit card not found");
            }

            return creditCard;
        } catch (error) {
            console.error("error in find-one-credit-card: ", error);
            handleError(error, "while getting credit card");
        }
    }

    async searchCreditCardsByNumber(
        searchTerm: string,
        page_number: number = 1,
        limit?: number
    ) {
        try {
            if (!searchTerm || searchTerm.trim().length === 0) {
                throw new ForbiddenException("Search term is required");
            }

            // Remove spaces and special characters from search term for better matching
            const cleanSearchTerm = searchTerm.replace(/[\s\-]/g, "");

            const queryBuilder = this.creditCardRepo
                .createQueryBuilder("creditCard")
                .select([
                    "creditCard.id",
                    "creditCard.card_number",
                    "creditCard.card_holder_name",
                    "creditCard.card_type",
                    "creditCard.cvv",
                    "creditCard.expiry_month",
                    "creditCard.expiry_year",
                ])
                .where(
                    "REPLACE(REPLACE(creditCard.card_number, ' ', ''), '-', '') LIKE :searchTerm",
                    {
                        searchTerm: `%${cleanSearchTerm}%`,
                    }
                )
                .orderBy("creditCard.id", "DESC");

            if (limit === undefined || limit === null) {
                const creditCardList = await queryBuilder.getMany();
                return {
                    data: creditCardList,
                    total: creditCardList.length,
                    search_term: searchTerm,
                };
            } else {
                const [creditCardList, total] = await queryBuilder
                    .skip((page_number - 1) * limit)
                    .take(limit)
                    .getManyAndCount();

                return paginationResponse({
                    data: creditCardList,
                    total,
                    page: page_number,
                    limit,
                });
            }
        } catch (error) {
            console.error("error in search-credit-cards-by-number: ", error);
            handleError(error, "while searching credit cards by number");
        }
    }

    // Charges Methods
    async createCharge(dto: CreateChargeDto) {
        const transaction = await this.queryService.createTransaction();
        try {
            await transaction.startTransaction();

            // Generate ref_no by finding the maximum existing ref_no and incrementing it
            const maxRefNo = await this.chargesRepo
                .createQueryBuilder("charge")
                .select("MAX(charge.ref_no)", "maxRefNo")
                .where("charge.sbu_id = :sbu_id", { sbu_id: dto.sbu_id })
                .getRawOne();

            const nextRefNo = (maxRefNo?.maxRefNo || 0) + 1;

            const newCharge = new MasterCharges();
            Object.assign(newCharge, dto);
            newCharge.ref_no = nextRefNo;
            newCharge.created_by = Number(getCurrentUser("user_id"));

            const res = await transaction.save(MasterCharges, newCharge);

            await transaction.commitTransaction();
            return res;
        } catch (error) {
            console.error("error in create-charge: ", error);
            await transaction.rollbackTransaction();
            handleError(error);
        } finally {
            await transaction.release();
        }
    }

    async createRoomCharge(dto: CreateRoomChargeDto) {
        const transaction = await this.queryService.createTransaction();
        try {
            await transaction.startTransaction();

            // Generate ref_no by finding the maximum existing ref_no and incrementing it
            const maxRefNo = await this.chargesRepo
                .createQueryBuilder("charge")
                .select("MAX(charge.ref_no)", "maxRefNo")
                .where("charge.sbu_id = :sbu_id", { sbu_id: dto.sbu_id })
                .getRawOne();

            const nextRefNo = (maxRefNo?.maxRefNo || 0) + 1;

            const newCharge = new MasterCharges();
            Object.assign(newCharge, dto);
            newCharge.ref_no = nextRefNo;
            newCharge.created_by = Number(getCurrentUser("user_id"));
            newCharge.type = ChargeType.ROOM_CHARGES;
            newCharge.charge_rule = ChargeRule.PER_BOOKING;
            newCharge.posting_type = PostingType.CHECK_OUT;

            const res = await transaction.save(MasterCharges, newCharge);

            await transaction.commitTransaction();
            return res;
        } catch (error) {
            console.error("error in create-charge: ", error);
            await transaction.rollbackTransaction();
            handleError(error);
        } finally {
            await transaction.release();
        }
    }

    async findOneCharge(id: number) {
        try {
            const charge = await this.chargesRepo.findOne({
                where: { id },
                relations: ["sbu", "reservation"],
            });
            if (!charge) {
                throw new NotFoundException("Charge not found");
            }

            return charge;
        } catch (error) {
            console.error("error in find-one-charge: ", error);
            handleError(error, "while getting charge");
        }
    }

    async updateCharge(id: number, dto: UpdateChargeDto) {
        const transaction = await this.queryService.createTransaction();
        try {
            await transaction.startTransaction();

            // Verify charge exists
            const charge = await this.chargesRepo.findOne({
                where: { id },
            });
            if (!charge) {
                throw new NotFoundException("Charge not found");
            }

            const updatedCharge = await transaction.update(
                MasterCharges,
                { id },
                {
                    ...dto,
                    updated_by: Number(getCurrentUser("user_id")),
                }
            );

            await transaction.commitTransaction();
            return updatedCharge;
        } catch (error) {
            console.error("error in update-charge: ", error);
            await transaction.rollbackTransaction();
            handleError(error, "while updating charge");
        } finally {
            await transaction.release();
        }
    }

    async removeCharge(id: number) {
        const transaction = await this.queryService.createTransaction();
        try {
            await transaction.startTransaction();

            // Verify charge exists
            const charge = await this.chargesRepo.findOne({
                where: { id },
            });
            if (!charge) {
                throw new NotFoundException("Charge not found");
            }

            await transaction.softDelete(
                MasterCharges,
                { id },
                {
                    deleted_by: Number(getCurrentUser("user_id")),
                }
            );

            await transaction.commitTransaction();
            return "Charge deleted successfully";
        } catch (error) {
            console.error("error in remove-charge: ", error);
            await transaction.rollbackTransaction();
            handleError(error, "while deleting charge");
        } finally {
            await transaction.release();
        }
    }

    // // Combined Charges and Payments Method
    // async getReservationOperations(dto: GetFolioOperationsDto) {
    //     try {
    //         const { page_number = 1, limit = 10 ,folio_id} = dto;

    //         // Build the payments query
    //         let paymentsQuery = `
    //             SELECT
    //                 p.created_at,
    //                 p.ref_no,
    //                 pm.name as type,
    //                 p.description,
    //                 u.id as user_id,
    //                 u.name as user_name,
    //                 u.email as user_email,
    //                 p.paid_amount as amount,
    //                 'payment' as record_type
    //             FROM master_payments p
    //             LEFT JOIN master_payment_modes pm ON p.payment_mode_id = pm.id
    //             LEFT JOIN master_users u ON p.created_by = u.id
    //             WHERE p.deleted_at IS NULL
    //         `;

    //         const paymentsParams: any[] = [];

    //         if (sbu_id) {
    //             paymentsQuery += ` AND p.sbu_id = ?`;
    //             paymentsParams.push(sbu_id);
    //         }

    //         if (reservation_id) {
    //             paymentsQuery += ` AND p.reservation_id = ?`;
    //             paymentsParams.push(reservation_id);
    //         }

    //         // Build the charges query
    //         let chargesQuery = `
    //             SELECT
    //                 c.created_at,
    //                 c.ref_no,
    //                 c.type,
    //                 c.description,
    //                 u.id as user_id,
    //                 u.name as user_name,
    //                 u.email as user_email,
    //                 c.amount,
    //                 'charge' as record_type
    //             FROM master_charges c
    //             LEFT JOIN master_users u ON c.created_by = u.id
    //             WHERE c.deleted_at IS NULL
    //         `;

    //         const chargesParams: any[] = [];

    //         if (sbu_id) {
    //             chargesQuery += ` AND c.sbu_id = ?`;
    //             chargesParams.push(sbu_id);
    //         }

    //         if (reservation_id) {
    //             chargesQuery += ` AND c.reservation_id = ?`;
    //             chargesParams.push(reservation_id);
    //         }

    //         // Combine queries with UNION ALL and order by created_at DESC (payments first, then charges)
    //         const combinedQuery = `
    //             (${paymentsQuery})
    //             UNION ALL
    //             (${chargesQuery})
    //             ORDER BY record_type ASC, created_at DESC
    //             LIMIT ? OFFSET ?
    //         `;

    //         // Count query for pagination
    //         const countQuery = `
    //             SELECT COUNT(*) as total FROM (
    //                 (${paymentsQuery})
    //                 UNION ALL
    //                 (${chargesQuery})
    //             ) as combined
    //         `;

    //         const offset = (page_number - 1) * limit;
    //         const queryParams = [...paymentsParams, ...chargesParams, limit, offset];
    //         const countParams = [...paymentsParams, ...chargesParams];

    //         // Execute both queries
    //         const [results, countResult] = await Promise.all([
    //             this.dataSource.query(combinedQuery, queryParams),
    //             this.dataSource.query(countQuery, countParams)
    //         ]);

    //         const total = countResult[0]?.total || 0;

    //         // Transform the results to match the expected format
    //         const transformedData = results.map((item: any) => ({
    //             created_at: item.created_at,
    //             ref_no: item.ref_no,
    //             type: item.type,
    //             description: item.description,
    //             user: {
    //                 id: item.user_id,
    //                 name: item.user_name,
    //                 email: item.user_email
    //             },
    //             amount: parseFloat(item.amount),
    //             record_type: item.record_type
    //         }));

    //         return paginationResponse({
    //             data: transformedData,
    //             total,
    //             page: page_number,
    //             limit,
    //         });

    //     } catch (error) {
    //         console.error("error in find-charges-and-payments: ", error);
    //         handleError(error, "while getting charges and payments");
    //     }
    // }

    async createSourceInfo(dto: CreateReservationSourceInfoDto) {
        const transaction = await this.queryService.createTransaction();
        try {
            await transaction.startTransaction();

            const newSource = new ReservationSourceInfo();
            Object.assign(newSource, dto);
            newSource.created_by = Number(getCurrentUser("user_id"));

            const res = await transaction.save(
                ReservationSourceInfo,
                newSource
            );

            await transaction.commitTransaction();
            return res;
        } catch (error) {
            console.error("error in create-reservation-source: ", error);
            await transaction.rollbackTransaction();
            handleError(error);
        } finally {
            await transaction.release();
        }
    }

    async findAllReservationSources(dto: GetReservationSourcesInfoDto) {
        try {
            const { page_number = 1, limit, reservation_id } = dto;

            if (limit === undefined || limit === null) {
                const sourceList = await this.reservationSourceInfoRepo.find({
                    order: {
                        id: "ASC",
                    },
                    where: { reservation_id },
                });

                return sourceList;
            } else {
                const [sourceList, total] =
                    await this.reservationSourceInfoRepo.findAndCount({
                        skip: (page_number - 1) * limit,
                        take: limit,
                        order: {
                            id: "ASC",
                        },
                        where: { reservation_id },
                    });

                return paginationResponse({
                    data: sourceList,
                    total,
                    page: page_number,
                    limit: limit,
                });
            }
        } catch (error) {
            console.error("error occurred in find-all-source-infos: ", error);
            handleError(error, "while getting all source-infos");
        }
    }

    async findReservationSourceInfoById(id: number) {
        try {
            const source = await this.reservationSourceInfoRepo.findOne({
                where: { id },
            });
            if (!source) {
                throw new NotFoundException("source was not found");
            }

            return source;
        } catch (error) {
            console.error("error in find-one-source: ", error);
            handleError(error, "while getting tax");
        }
    }

    async updateReservationSourceInfo(
        id: number,
        dto: UpdateReservationSourceInfoDto
    ) {
        const transaction = await this.queryService.createTransaction();
        try {
            await transaction.startTransaction();

            const updatedValu = await transaction.update(
                ReservationSourceInfo,
                { id },
                {
                    ...dto,
                    updated_by: Number(getCurrentUser("user_id")),
                }
            );

            await transaction.commitTransaction();
            return updatedValu;
        } catch (error) {
            console.error("error in update-reservation-source: ", error);
            await transaction.rollbackTransaction();
            handleError(error, "while updating reservation-source");
        } finally {
            await transaction.release();
        }
    }

    async deleteReservationSource(id: number) {
        const transaction = await this.queryService.createTransaction();
        try {
            await transaction.startTransaction();

            await transaction.softDelete(
                ReservationSourceInfo,
                { id },
                { deleted_by: Number(getCurrentUser("user_id")) }
            );

            await transaction.commitTransaction();
            return `reservation-source was deleted successfully`;
        } catch (error) {
            console.error("error in remove-reservation-source: ", error);
            await transaction.rollbackTransaction();
            handleError(error, "while deleting reservation-source");
        } finally {
            await transaction.release();
        }
    }

    // Folio Methods
    async createFolio(dto: CreateFolioDto) {
        const transaction = await this.queryService.createTransaction();
        try {
            await transaction.startTransaction();

            // Verify reservation exists
            const reservation = await this.reservationRepo.findOne({
                where: { id: dto.reservation_id },
            });
            if (!reservation) {
                throw new NotFoundException("Reservation not found");
            }

            // Generate folio number with auto-increment
            const folioNo = await this.generateFolioNumber(dto.sbu_id);

            const newFolio = new MasterFolios();
            Object.assign(newFolio, dto);
            newFolio.folio_no = folioNo;
            newFolio.created_by = Number(getCurrentUser("user_id"));

            const savedFolio = await transaction.save(MasterFolios, newFolio);

            await transaction.commitTransaction();
            return savedFolio;
        } catch (error) {
            console.error("error in create-folio: ", error);
            await transaction.rollbackTransaction();
            handleError(error);
        } finally {
            await transaction.release();
        }
    }

    async findAllFolios(dto: GetFoliosDto) {
        try {
            const {
                page_number = 1,
                limit,
                sbu_id,
                reservation_id,
                guest_id,
            } = dto;

            const queryBuilder = this.foliosRepo
                .createQueryBuilder("folio")
                .leftJoinAndSelect("folio.guest", "guest")
                .leftJoinAndSelect("folio.sbu", "sbu")
                .leftJoinAndSelect("folio.reservation", "reservation")
                .leftJoinAndSelect("folio.charges", "charges")
                .leftJoinAndSelect("folio.payments", "payments");

            if (sbu_id) {
                queryBuilder.where("folio.sbu_id = :sbu_id", { sbu_id });
            }

            if (reservation_id) {
                if (sbu_id) {
                    queryBuilder.andWhere(
                        "folio.reservation_id = :reservation_id",
                        { reservation_id }
                    );
                } else {
                    queryBuilder.where(
                        "folio.reservation_id = :reservation_id",
                        { reservation_id }
                    );
                }
            }

            if (guest_id) {
                const condition =
                    sbu_id || reservation_id ? "andWhere" : "where";
                queryBuilder[condition]("folio.guest_id = :guest_id", {
                    guest_id,
                });
            }

            queryBuilder.orderBy("folio.id", "ASC");

            if (limit === undefined || limit === null) {
                const folioList = await queryBuilder.getMany();
                return folioList;
            } else {
                const [folioList, total] = await queryBuilder
                    .skip((page_number - 1) * limit)
                    .take(limit)
                    .getManyAndCount();

                return paginationResponse({
                    data: folioList,
                    total,
                    page: page_number,
                    limit,
                });
            }
        } catch (error) {
            console.error("error in find-all-folios: ", error);
            handleError(error, "while getting all folios");
        }
    }

    async findOneFolio(id: number) {
        try {
            const folio = await this.foliosRepo.findOne({
                where: { id },
                relations: [
                    "guest",
                    "sbu",
                    "reservation",
                    "charges",
                    "payments",
                ],
            });
            if (!folio) {
                throw new NotFoundException("Folio not found");
            }

            return folio;
        } catch (error) {
            console.error("error in find-one-folio: ", error);
            handleError(error, "while getting folio");
        }
    }

    async getFolioOperations(dto: GetFolioOperationsDto) {
        try {
            const { folio_id, page_number = 1, limit = 10 } = dto;

            // Verify folio exists
            const folio = await this.foliosRepo.findOne({
                where: { id: folio_id },
                relations: ["guest", "sbu", "reservation"],
            });

            if (!folio) {
                throw new NotFoundException("Folio not found");
            }

            // Get charges for the folio
            const [charges, totalCharges] = await this.chargesRepo.findAndCount(
                {
                    where: { folio_id },
                    relations: ["folio"],
                    order: { created_at: "DESC" },
                    skip: (page_number - 1) * limit,
                    take: limit,
                }
            );

            // Get payments for the folio
            const [payments, totalPayments] =
                await this.paymentsRepo.findAndCount({
                    where: { folio_id },
                    relations: ["folio"],
                    order: { created_at: "DESC" },
                    skip: (page_number - 1) * limit,
                    take: limit,
                });

            // Get discounts for the folio
            const [discounts, totalDiscounts] =
                await this.folioDiscountRepo.findAndCount({
                    where: { folio_id },
                    relations: ["folio"],
                    order: { created_at: "DESC" },
                    skip: (page_number - 1) * limit,
                    take: limit,
                });

            // Calculate totals
            const totalChargesAmount = await this.chargesRepo
                .createQueryBuilder("charge")
                .select("COALESCE(SUM(charge.amount), 0)", "total")
                .where("charge.folio_id = :folio_id", { folio_id })
                .andWhere("charge.deleted_at IS NULL")
                .getRawOne();

            const totalPaymentsAmount = await this.paymentsRepo
                .createQueryBuilder("payment")
                .select("COALESCE(SUM(payment.paid_amount), 0)", "total")
                .where("payment.folio_id = :folio_id", { folio_id })
                .andWhere("payment.deleted_at IS NULL")
                .getRawOne();

            const totalDiscountsAmount = await this.folioDiscountRepo
                .createQueryBuilder("discount")
                .select("COALESCE(SUM(discount.discount_amount), 0)", "total")
                .where("discount.folio_id = :folio_id", { folio_id })
                .andWhere("discount.deleted_at IS NULL")
                .getRawOne();

            const balance =
                parseFloat(totalChargesAmount.total) -
                parseFloat(totalPaymentsAmount.total) -
                parseFloat(totalDiscountsAmount.total);

            return {
                folio: {
                    id: folio.id,
                    folio_no: folio.folio_no,
                    status: folio.status,
                    folio_type: folio.folio_type,
                    guest: folio.guest,
                    sbu: folio.sbu,
                    reservation: folio.reservation,
                },
                operations: {
                    charges: {
                        data: charges,
                        total: totalCharges,
                        amount: parseFloat(totalChargesAmount.total),
                    },
                    payments: {
                        data: payments,
                        total: totalPayments,
                        amount: parseFloat(totalPaymentsAmount.total),
                    },
                    discounts: {
                        data: discounts,
                        total: totalDiscounts,
                        amount: parseFloat(totalDiscountsAmount.total),
                    },
                },
                summary: {
                    total_charges: parseFloat(totalChargesAmount.total),
                    total_payments: parseFloat(totalPaymentsAmount.total),
                    total_discounts: parseFloat(totalDiscountsAmount.total),
                    balance: balance,
                },
                pagination: {
                    page: page_number,
                    limit: limit,
                    total_operations:
                        totalCharges + totalPayments + totalDiscounts,
                },
            };
        } catch (error) {
            console.error("error in get-folio-operations: ", error);
            handleError(error, "while getting folio operations");
        }
    }

    async cutFolio(dto: CutFolioDto) {
        const transaction = await this.queryService.createTransaction();
        try {
            await transaction.startTransaction();

            // Get the original folio
            const originalFolio = await this.foliosRepo.findOne({
                where: { id: dto.folio_id },
                relations: ["guest", "reservation"],
            });

            if (!originalFolio) {
                throw new NotFoundException("Original folio not found");
            }

            // Query for charge_ids and payment_ids based on boolean flags
            let charge_ids: number[] = [];
            let payment_ids: number[] = [];

            if (dto.charges) {
                const charges = await this.chargesRepo.find({
                    where: { folio_id: dto.folio_id },
                    select: ["id"],
                });
                charge_ids = charges.map((charge) => charge.id);
            }

            if (dto.payments) {
                const payments = await this.paymentsRepo.find({
                    where: { folio_id: dto.folio_id },
                    select: ["id"],
                });
                payment_ids = payments.map((payment) => payment.id);
            }

            // Create new folio with same details but new folio number
            const folioNo = await this.generateFolioNumber(dto.sbu_id);

            const newFolio = new MasterFolios();
            newFolio.folio_no = folioNo;
            newFolio.guest_id = originalFolio.guest_id;
            newFolio.sbu_id = originalFolio.sbu_id;
            newFolio.folio_type = originalFolio.folio_type;
            newFolio.reservation_id = originalFolio.reservation_id;
            newFolio.created_by = Number(getCurrentUser("user_id"));

            const savedNewFolio: any = await transaction.save(
                MasterFolios,
                newFolio
            );

            await transaction.update(
                MasterFolios,
                {
                    id: originalFolio.id,
                },
                {
                    status: FolioStatus.CUT,
                }
            );

            // Move specified charges to new folio
            if (charge_ids.length > 0) {
                await transaction.update(
                    MasterCharges,
                    { id: In(charge_ids) },
                    { folio_id: savedNewFolio.id }
                );
            }

            // Move specified payments to new folio
            if (payment_ids.length > 0) {
                await transaction.update(
                    MasterPayments,
                    { id: In(payment_ids) },
                    { folio_id: savedNewFolio.id }
                );
            }

            // Log the folio cut operation
            await this.auditLogService.logFolioCutOperation(
                originalFolio.reservation_id,
                dto.sbu_id,
                originalFolio.folio_no,
                savedNewFolio.folio_no,
                charge_ids.length,
                payment_ids.length
            );

            await transaction.commitTransaction();

            return {
                message: "Folio cut successfully",
                original_folio_id: dto.folio_id,
                new_folio_id: savedNewFolio.id,
                new_folio_no: savedNewFolio.folio_no,
                moved_charges: charge_ids.length,
                moved_payments: payment_ids.length,
            };
        } catch (error) {
            console.error("error in cut-folio: ", error);
            await transaction.rollbackTransaction();
            handleError(error);
        } finally {
            await transaction.release();
        }
    }

    async splitFolio(dto: SplitFolioDto) {
        const transaction = await this.queryService.createTransaction();
        try {
            await transaction.startTransaction();

            // Verify both folios exist
            const [sourceFolio, targetFolio] = await Promise.all([
                this.foliosRepo.findOne({ where: { id: dto.source_folio_id } }),
                this.foliosRepo.findOne({ where: { id: dto.target_folio_id } }),
            ]);

            if (!sourceFolio) {
                throw new NotFoundException("Source folio not found");
            }

            if (!targetFolio) {
                throw new NotFoundException("Target folio not found");
            }

            // Move specified charges from source to target folio
            if (dto.charge_ids && dto.charge_ids.length > 0) {
                await transaction.update(
                    MasterCharges,
                    { id: In(dto.charge_ids) },
                    { folio_id: dto.target_folio_id }
                );
            }

            // Move specified payments from source to target folio
            if (dto.payment_ids && dto.payment_ids.length > 0) {
                await transaction.update(
                    MasterPayments,
                    { id: In(dto.payment_ids) },
                    { folio_id: dto.target_folio_id }
                );
            }

            await transaction.commitTransaction();

            return {
                message: "Folio split successfully",
                source_folio_id: dto.source_folio_id,
                target_folio_id: dto.target_folio_id,
                moved_charges: dto.charge_ids?.length || 0,
                moved_payments: dto.payment_ids?.length || 0,
            };
        } catch (error) {
            console.error("error in split-folio: ", error);
            await transaction.rollbackTransaction();
            handleError(error);
        } finally {
            await transaction.release();
        }
    }

    async createPayment(dto: CreatePaymentDto) {
        const transaction = await this.queryService.createTransaction();
        try {
            await transaction.startTransaction();

            // Verify reservation exists
            const reservation = await this.reservationRepo.findOne({
                where: { id: dto.reservation_id },
            });
            if (!reservation) {
                throw new NotFoundException("Reservation not found");
            }

            // Generate ref_no for payment by finding the maximum existing ref_no and incrementing it
            const maxPaymentRefNo = await this.paymentsRepo
                .createQueryBuilder("payment")
                .select("MAX(payment.ref_no)", "maxRefNo")
                .where("payment.sbu_id = :sbu_id", { sbu_id: dto.sbu_id })
                .getRawOne();

            const nextPaymentRefNo = (maxPaymentRefNo?.maxRefNo || 0) + 1;

            const newPayment = new MasterPayments();
            Object.assign(newPayment, dto);
            newPayment.ref_no = nextPaymentRefNo;
            newPayment.paid_date = dto.paid_date
                ? new Date(dto.paid_date)
                : new Date();
            newPayment.created_by = Number(getCurrentUser("user_id"));

            const savedPayment = await transaction.save(
                MasterPayments,
                newPayment
            );

            await transaction.commitTransaction();
            return savedPayment;
        } catch (error) {
            console.error("error in create-payment: ", error);
            await transaction.rollbackTransaction();
            handleError(error);
        } finally {
            await transaction.release();
        }
    }

    async updateFolio(id: number, dto: UpdateFolioDto) {
        const transaction = await this.queryService.createTransaction();
        try {
            await transaction.startTransaction();

            const updatedFolio = await transaction.update(
                MasterFolios,
                { id },
                {
                    ...dto,
                    updated_by: Number(getCurrentUser("user_id")),
                }
            );

            await transaction.commitTransaction();
            return updatedFolio;
        } catch (error) {
            console.error("error in update-folio: ", error);
            await transaction.rollbackTransaction();
            handleError(error, "while updating folio");
        } finally {
            await transaction.release();
        }
    }

    async transferAmount(dto: TransferAmountDto) {
        const transaction = await this.queryService.createTransaction();
        try {
            await transaction.startTransaction();

            const currentUserId = Number(getCurrentUser("user_id"));

            const [sourceFolio, targetFolio] = await Promise.all([
                this.foliosRepo.findOne({
                    where: { id: dto.source_folio_id },
                    relations: ["reservation"],
                }),
                this.foliosRepo.findOne({
                    where: { id: dto.target_folio_id },
                    relations: ["reservation"],
                }),
            ]);

            if (!sourceFolio) {
                throw new NotFoundException("Source folio not found");
            }

            if (!targetFolio) {
                throw new NotFoundException("Target folio not found");
            }

            let transferAmount: number;

            if (dto.amount) {
                transferAmount = dto.amount;
            } else {
                // Calculate due amount (charges - payments) for source folio
                const chargesTotal = await this.chargesRepo
                    .createQueryBuilder("charge")
                    .select("COALESCE(SUM(charge.amount), 0)", "total")
                    .where("charge.folio_id = :folio_id", {
                        folio_id: dto.source_folio_id,
                    })
                    .andWhere("charge.deleted_at IS NULL")
                    .getRawOne();

                const paymentsTotal = await this.paymentsRepo
                    .createQueryBuilder("payment")
                    .select("COALESCE(SUM(payment.paid_amount), 0)", "total")
                    .where("payment.folio_id = :folio_id", {
                        folio_id: dto.source_folio_id,
                    })
                    .andWhere("payment.deleted_at IS NULL")
                    .getRawOne();

                transferAmount =
                    parseFloat(chargesTotal.total) -
                    parseFloat(paymentsTotal.total);

                // If due amount is zero or negative, no transfer needed
                if (transferAmount <= 0) {
                    throw new ForbiddenException(
                        `No due amount to transfer. Current balance: ${transferAmount.toFixed(2)}`
                    );
                }
            }

            // Generate ref_no for both charges
            const maxRefNo = await this.chargesRepo
                .createQueryBuilder("charge")
                .select("MAX(charge.ref_no)", "maxRefNo")
                .where("charge.sbu_id = :sbu_id", { sbu_id: dto.sbu_id })
                .getRawOne();

            const nextRefNo = (maxRefNo?.maxRefNo || 0) + 1;

            const description =
                dto.description ||
                `Amount transfer from folio ${sourceFolio.folio_no} to ${targetFolio.folio_no}`;

            // Create negative charge for source folio (debit)
            const sourceCharge = new MasterCharges();
            sourceCharge.ref_no = nextRefNo;
            sourceCharge.folio_id = dto.source_folio_id;
            sourceCharge.sbu_id = dto.sbu_id;
            sourceCharge.amount = -Math.abs(transferAmount); // Ensure negative amount
            sourceCharge.description = `${description} (Transfer Out)`;
            sourceCharge.type = ChargeType.BALANCE_TRANSFER;
            sourceCharge.is_tax_included = false;
            sourceCharge.created_by = currentUserId;

            // Create positive charge for target folio (credit)
            const targetCharge = new MasterCharges();
            targetCharge.ref_no = nextRefNo + 1;
            targetCharge.folio_id = dto.target_folio_id;
            targetCharge.sbu_id = dto.sbu_id;
            targetCharge.amount = Math.abs(transferAmount); // Ensure positive amount
            targetCharge.description = `${description} (Transfer In)`;
            targetCharge.type = ChargeType.BALANCE_TRANSFER;
            targetCharge.is_tax_included = false;
            targetCharge.created_by = currentUserId;

            // Save both charges
            await transaction.save(MasterCharges, [sourceCharge, targetCharge]);

            // Log the transfer operation
            await this.auditLogService.logFolioTransferOperation(
                sourceFolio.reservation_id,
                dto.sbu_id,
                sourceFolio.folio_no,
                targetFolio.folio_no,
                transferAmount
            );

            await transaction.commitTransaction();

            return {
                message: "Amount transfer completed successfully",
                source_folio_id: dto.source_folio_id,
                source_folio_no: sourceFolio.folio_no,
                target_folio_id: dto.target_folio_id,
                target_folio_no: targetFolio.folio_no,
                transferred_amount: transferAmount,
                source_charge_ref_no: nextRefNo,
                target_charge_ref_no: nextRefNo + 1,
                description: description,
                transfer_date: new Date(),
            };
        } catch (error) {
            console.error("error in transfer-amount: ", error);
            await transaction.rollbackTransaction();
            handleError(error);
        } finally {
            await transaction.release();
        }
    }

    async addDiscount(dto: AddDiscountDto) {
        const transaction = await this.queryService.createTransaction();
        try {
            await transaction.startTransaction();

            // Verify folio exists
            const folio = await this.foliosRepo.findOne({
                where: { id: dto.folio_id },
            });

            if (!folio) {
                throw new NotFoundException("Folio not found");
            }

            // Create new discount record
            const newDiscount = new MasterFolioDiscount();
            newDiscount.discount_id = dto.discount_id;
            newDiscount.discount_amount = dto.discount_amount;
            newDiscount.folio_id = dto.folio_id;
            newDiscount.description = dto.description;
            newDiscount.created_by = Number(getCurrentUser("user_id"));

            const savedDiscount = await transaction.save(
                MasterFolioDiscount,
                newDiscount
            );

            // Log the discount operation
            await this.auditLogService.logDiscountOperation(
                folio.reservation_id,
                folio.sbu_id,
                dto.discount_amount,
                dto.description || "Discount Applied",
                folio.folio_no
            );

            await transaction.commitTransaction();

            return {
                message: "Discount added successfully",
                discount: savedDiscount,
            };
        } catch (error) {
            console.error("error in add-discount: ", error);
            await transaction.rollbackTransaction();
            handleError(error, "while adding discount");
        } finally {
            await transaction.release();
        }
    }

    async getReservationRooms(dto: GetReservationRoomsDto) {
        try {
            const { reservation_id } = dto;

            // Verify reservation exists
            const reservation = await this.reservationRepo.findOne({
                where: { id: reservation_id },
                select: ["id", "reservation_number", "status"],
            });

            if (!reservation) {
                throw new NotFoundException("Reservation not found");
            }

            // Fetch reservation rooms with room and room type details
            const reservationRooms = await this.dataSource
                .getRepository(ReservationRoom)
                .createQueryBuilder("reservationRoom")
                .leftJoinAndSelect("reservationRoom.room", "room")
                .leftJoinAndSelect("reservationRoom.roomType", "roomType")

                .where("reservationRoom.reservation_id = :reservation_id", {
                    reservation_id,
                })
                .andWhere("reservationRoom.deleted_at IS NULL")
                .select([
                    "reservationRoom.id",
                    "reservationRoom.reservation_id",
                    "reservationRoom.room_id",
                    "reservationRoom.adults_in_room",
                    "reservationRoom.children_in_room",
                    "reservationRoom.room_rate",
                    "reservationRoom.is_assigned",
                    "reservationRoom.room_type_id",
                    "reservationRoom.rate_type_id",
                    "room.id",
                    "room.room_number",
                    "room.status",
                    "room.room_type_id",
                    "roomType.id",
                    "roomType.name",
                    "roomType.description",
                ])
                .orderBy("reservationRoom.id", "ASC")
                .getMany();

            // Calculate summary
            const summary = {
                total_rooms: reservationRooms.length,
                total_adults: reservationRooms.reduce(
                    (sum, room) => sum + (room.adults_in_room || 0),
                    0
                ),
                total_children: reservationRooms.reduce(
                    (sum, room) => sum + (room.children_in_room || 0),
                    0
                ),
                total_rate: reservationRooms.reduce(
                    (sum, room) => sum + (room.room_rate || 0),
                    0
                ),
                assigned_rooms: reservationRooms.filter(
                    (room) => room.is_assigned
                ).length,
                unassigned_rooms: reservationRooms.filter(
                    (room) => !room.is_assigned
                ).length,
            };

            return {
                reservation: {
                    id: reservation.id,
                    reservation_number: reservation.reservation_number,
                    status: reservation.status,
                },
                rooms: reservationRooms,
                summary,
            };
        } catch (error) {
            console.error("error in get-reservation-rooms: ", error);
            handleError(error, "while getting reservation rooms");
        }
    }

    async findRoomCharges(dto: FindRoomChargesDto) {
        try {
            const { reservation_id, room_id } = dto;

            // First, get reservation details to get check-in and check-out dates
            const reservation = await this.reservationRepo.findOne({
                where: { id: reservation_id },
                select: [
                    "id",
                    "reservation_number",
                    "check_in_datetime",
                    "check_out_datetime",
                    "sbu_id",
                ],
            });

            if (!reservation) {
                throw new NotFoundException("Reservation not found");
            }

            // Raw query to get room charges grouped by date with reservation rooms info
            const rawQuery = `
            SELECT 
                mc.charge_date,
                rr.room_id,
                mr.room_number,
                rr.rate_type_id,
                rr.adults_in_room,
                rr.children_in_room,
                rr.room_rate
            FROM master_charges mc
            INNER JOIN master_folios mf ON mc.folio_id = mf.id
            INNER JOIN reservation_rooms rr ON rr.reservation_id = mf.reservation_id
            INNER JOIN master_rooms mr ON rr.room_id = mr.id
            WHERE mf.reservation_id = ?
                AND rr.room_id = ?
                AND rr.is_assigned = 1
                AND mc.deleted_at IS NULL
                AND mf.deleted_at IS NULL
                AND mr.deleted_at IS NULL
                AND rr.deleted_at IS NULL
                AND mc.charge_date >= ?
                AND mc.charge_date <= ?
            GROUP BY mc.charge_date, mr.room_number
            ORDER BY charge_date ASC
        `;

            const nextDay = addTime(
                formatDateTime(reservation.check_out_datetime),
                1,
                "day"
            );

            const results = await this.dataSource.query(rawQuery, [
                reservation_id,
                room_id,
                formatDateTime(reservation.check_in_datetime),
                formatDateTime(nextDay),
            ]);

            const processedResults: any = [];
            for (let row of results) {
                const { original_amount, total_tax_amount, total_amount } =
                    await this.taxService.getTaxAmount({
                        amount: Number(row.room_rate),
                    });

                processedResults.push({
                    ...row,
                    charge_date: formatDateTime(row.charge_date),
                    original_amount,
                    total_tax_amount,
                    total_amount,
                });
            }

            return {
                reservation: {
                    id: reservation.id,
                    reservation_number: reservation.reservation_number,
                    check_in_date: formatDateTime(
                        reservation.check_in_datetime
                    ),
                    check_out_date: formatDateTime(
                        reservation.check_out_datetime
                    ),
                },
                room_id,
                charges: processedResults,
            };
        } catch (error) {
            console.error("error in find-room-charges: ", error);
            handleError(error, "while getting room charges");
        }
    }

    async assignRoom(dto: AssignRoomDto) {
        const transaction = await this.queryService.createTransaction();
        try {
            await transaction.startTransaction();

            // Check if the reservation exists
            const reservation = await this.reservationRepo.findOne({
                where: { id: dto.reservation_id },
                select: ["id", "sbu_id", "reservation_number", "status"],
            });

            if (!reservation) {
                throw new NotFoundException("Reservation not found");
            }

            // Check if the room exists in the reservation
            const reservationRoom = await this.reservationRoomRepo.findOne({
                where: {
                    reservation_id: dto.reservation_id,
                    room_id: dto.room_id,
                },
            });

            if (!reservationRoom) {
                throw new NotFoundException(
                    "Room not found in this reservation"
                );
            }

            // Check if the room is already assigned
            if (reservationRoom.is_assigned) {
                throw new ForbiddenException(
                    "Room is already assigned to this reservation"
                );
            }

            // Update the room assignment status
            await transaction.update(
                ReservationRoom,
                {
                    reservation_id: dto.reservation_id,
                    room_id: dto.room_id,
                },
                {
                    is_assigned: true,
                    updated_by: Number(getCurrentUser("user_id")),
                }
            );

            // Log the room assignment operation
            await this.auditLogService.logFolioOperation(
                dto.reservation_id,
                reservation.sbu_id,
                "ROOM_ASSIGNED",
                { title: "Room Assignment" },
                {
                    title: "Room Assigned",
                    description: `Room ${dto.room_id} assigned to reservation ${reservation.reservation_number}`,
                }
            );

            await transaction.commitTransaction();

            return {
                message: "Room assigned successfully",
                reservation_id: dto.reservation_id,
                room_id: dto.room_id,
            };
        } catch (error) {
            console.error("error in assign-room: ", error);
            await transaction.rollbackTransaction();
            handleError(error, "while assigning room");
        } finally {
            await transaction.release();
        }
    }

    async fetchRoomWiseFoliosByReservationId(reservation_id: number) {
        try {
            // Raw SQL query string
            const query = `
            SELECT 
              rt.id AS room_type_id,
              rt.short_name,
              rt.description AS room_type_description,
              rt.base_occupancy_adult,
              rt.base_occupancy_child,
              rt.max_occupancy_adult,
              rt.max_occupancy_child,
              rt.extra_bed_price,

              r.id AS room_id,
              r.room_number,
              r.room_rate,
              r.description AS room_description,
              r.room_code,

              f.id AS folio_id,
              f.folio_no,
              f.folio_type,
              f.status AS folio_status,
              guest.name as guest_name

            FROM reservation_rooms rr

            JOIN master_room_types rt ON rr.room_type_id = rt.id
            JOIN master_rooms r ON rr.room_id = r.id
            JOIN master_folios f ON rr.folio_id = f.id
            JOIN master_guests guest ON guest.id = f.guest_id

            WHERE rr.reservation_id = ?
            ORDER BY rt.id, r.id, f.id;
        `;

            // Execute the raw query (adjust to your DB client)
            const rawData = await this.dataSource.query(query, [
                reservation_id,
            ]);

            // Transform flat rows into nested structure
            const roomTypesMap = new Map();

            for (const row of rawData) {
                // <-- Changed here from rawData.rows to rawData
                let roomType = roomTypesMap.get(row.room_type_id);
                if (!roomType) {
                    roomType = {
                        id: row.room_type_id,
                        short_name: row.short_name,
                        description: row.room_type_description,
                        base_occupancy_adult: row.base_occupancy_adult,
                        base_occupancy_child: row.base_occupancy_child,
                        max_occupancy_adult: row.max_occupancy_adult,
                        max_occupancy_child: row.max_occupancy_child,
                        extra_bed_price: row.extra_bed_price,
                        rooms: [],
                    };
                    roomTypesMap.set(row.room_type_id, roomType);
                }

                let room = roomType.rooms.find((r) => r.id === row.room_id);
                if (!room) {
                    room = {
                        id: row.room_id,
                        room_number: row.room_number,
                        room_rate: row.room_rate,
                        description: row.room_description,
                        room_code: row.room_code,
                        folios: [],
                    };
                    roomType.rooms.push(room);
                }

                // Add folio to the room
                room.folios.push({
                    id: row.folio_id,
                    folio_no: row.folio_no,
                    folio_type: row.folio_type,
                    status: row.folio_status,
                    guest_name: row.guest_name,
                });
            }

            // Convert map values to array for final response
            return { room_types: Array.from(roomTypesMap.values()) };
        } catch (error) {
            console.error("Error fetching room-wise folios:", error);
            throw error;
        }
    }
}
