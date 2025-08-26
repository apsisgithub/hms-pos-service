import { Injectable, NotFoundException, Inject } from "@nestjs/common";
import { CreateMasterSbuDto } from "./dto/create-master_sbu.dto";
import { UpdateMasterSbuDto } from "./dto/update-master_sbu.dto";
import { handleError } from "src/utils/handle-error.util";
import { InjectRepository } from "@nestjs/typeorm";
import { MasterSbu } from "./entities/master_sbu.entity";
import { Repository, In } from "typeorm";
import { QueryManagerService } from "src/common/query-manager/query.service";
import { GetSbusDto } from "./dto/get-sbus.dto"; // Added for pagination
import { paginationResponse } from "src/utils/pagination-response.util"; // Ensure this import path is correct
import { getCurrentUser } from "src/common/utils/user.util"; // Ensure this import path is correct

@Injectable()
export class MasterSbuService {
    constructor(
        @Inject() private readonly queryService: QueryManagerService,
        @InjectRepository(MasterSbu)
        private readonly masterSbuRepo: Repository<MasterSbu>
    ) {}

    async createSbu(dto: CreateMasterSbuDto) {
        const transaction = await this.queryService.createTransaction();
        try {
            await transaction.startTransaction();

            const newSbu = new MasterSbu();
            Object.assign(newSbu, dto);
            newSbu.created_by = Number(getCurrentUser("user_id")); // Assign created_by

            const res = await transaction.save(MasterSbu, newSbu); // Use transaction.save

            await transaction.commitTransaction();
            return res;
        } catch (error) {
            console.error("error in create-sbu: ", error);
            await transaction.rollbackTransaction();
            handleError(error, "while creating sbu");
        } finally {
            await transaction.release();
        }
    }

    async findAllSbu(dto: GetSbusDto) {
        try {
            const { page_number = 1, limit, sbu_ids } = dto;

            const whereCondition: any = {};
            if (sbu_ids?.length) {
                whereCondition.id = In(sbu_ids);
            }

            const transformRecord = (record: any) => ({
                id: record?.id,
                name: record?.name || "",
                address: record?.address || "",
                email: record?.email || "",
                phone: record?.phone || "",
                website: record?.website || "",
                logo_dimension: record?.logo_dimension || "",
                country: record?.country || "",
                city: record?.city || "",
                grade: record?.grade || "",
                bin_number: record?.bin_number || "",
                currency_code: record?.currency_code || "",
                pos_outlets: record?.pos_outlets || [],
                total_rooms_count: record?.rooms_count || 0,
                assigned_ip: record?.assign_ip || "",
                vat_software: record?.vat_software || "",
                tax_rule: record?.tax_rule || "",
                hot_line: record?.hotline || "",
                fax: record?.fax || "",
                hotel_policy_description: record?.hotel_policy || "",
            });

            if (limit === undefined || limit === null) {
                const sbuList = await this.masterSbuRepo.find({
                    where: Object.keys(whereCondition).length
                        ? whereCondition
                        : undefined,
                    order: { id: "ASC" },
                });

                return sbuList.map(transformRecord);
            } else {
                const [sbuList, total] = await this.masterSbuRepo.findAndCount({
                    where: Object.keys(whereCondition).length
                        ? whereCondition
                        : undefined,
                    skip: (page_number - 1) * limit,
                    take: limit,
                    order: { id: "ASC" },
                });

                return paginationResponse({
                    data: sbuList.map(transformRecord),
                    total,
                    page: page_number,
                    limit,
                });
            }
        } catch (error) {
            console.error("error in find-all-sbu: ", error);
            handleError(error, "while getting all sbu");
        }
    }

    async findOneSbu(sbu_id: number) {
        try {
            const sbu = await this.masterSbuRepo.findOne({
                where: { id: sbu_id },
            });
            if (!sbu) {
                throw new NotFoundException("sbu was not found");
            }

            return sbu;
        } catch (error) {
            console.error("error in find-one-sbu: ", error);
            handleError(error, "while getting sbu");
        }
    }

    async updateSbu(sbu_id: number, dto: UpdateMasterSbuDto) {
        const transaction = await this.queryService.createTransaction();
        try {
            await transaction.startTransaction();

            // Directly update the SBU without fetching it first
            const updatedSbu = await transaction.update(
                MasterSbu,
                { id: sbu_id },
                {
                    ...dto,
                    updated_by: Number(getCurrentUser("user_id")),
                }
            );

            await transaction.commitTransaction();
            return updatedSbu;
        } catch (error) {
            console.error("error in update-sbu: ", error);
            await transaction.rollbackTransaction();
            handleError(error, "while updating sbu");
        } finally {
            await transaction.release();
        }
    }

    async removeSbu(sbu_id: number) {
        const transaction = await this.queryService.createTransaction();
        try {
            await transaction.startTransaction();

            // Directly soft delete the SBU without fetching it first
            await transaction.softDelete(
                MasterSbu,
                { id: sbu_id },
                { deleted_by: Number(getCurrentUser("user_id")) }
            );

            await transaction.commitTransaction();
            return `sbu was deleted successfully`;
        } catch (error) {
            console.error("error in remove-sbu: ", error);
            await transaction.rollbackTransaction();
            handleError(error, "while deleting sbu");
        } finally {
            await transaction.release();
        }
    }
}
