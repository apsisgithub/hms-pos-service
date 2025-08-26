import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { CreateMasterExtraChargeDto } from "./dto/create-master-extra-charge.dto";
import { UpdateMasterExtraChargeDto } from "./dto/update-master-extra-charge.dto";
import { QueryManagerService } from "src/common/query-manager/query.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import {
    ExtraChargesStatus,
    MasterExtraCharge,
} from "./entities/master-extra-charge.entity";
import { getCurrentUser } from "src/common/utils/user.util";
import { handleError } from "src/utils/handle-error.util";
import { paginationResponse } from "src/utils/pagination-response.util";
import { GetExtraChargessDto } from "./dto/get-extra-charges.dto";

@Injectable()
export class MasterExtraChargesService {
    constructor(
        @Inject() private readonly queryService: QueryManagerService,
        @InjectRepository(MasterExtraCharge)
        private readonly extraChargeRepo: Repository<MasterExtraCharge>
    ) {}
    async create(dto: CreateMasterExtraChargeDto) {
        const transaction = await this.queryService.createTransaction();
        try {
            await transaction.startTransaction();

            const newRate = new MasterExtraCharge();
            Object.assign(newRate, dto);
            newRate.created_by = Number(getCurrentUser("user_id"));

            const res = await transaction.save(MasterExtraCharge, newRate);

            await transaction.commitTransaction();
            return res;
        } catch (error) {
            console.error("error in create-extra-charges ", error);
            await transaction.rollbackTransaction();
            handleError(error, "while creating extra-charges");
        } finally {
            await transaction.release();
        }
    }

    async findAll(dto: GetExtraChargessDto) {
        try {
            const { page_number = 1, limit, sbu_id } = dto;

            if (limit === undefined || limit === null) {
                const extraCharges = await this.extraChargeRepo.find({
                    where: {
                        sbu_id,
                        status: ExtraChargesStatus.ACTIVE,
                    },
                    order: {
                        id: "ASC",
                    },
                });

                return extraCharges;
            } else {
                const [extraCharges, total] =
                    await this.extraChargeRepo.findAndCount({
                        skip: (page_number - 1) * limit,
                        take: limit,
                        where: {
                            sbu_id,
                            status: ExtraChargesStatus.ACTIVE,
                        },
                        order: {
                            id: "ASC",
                        },
                    });

                return paginationResponse({
                    data: extraCharges,
                    total,
                    page: page_number,
                    limit,
                });
            }
        } catch (error) {
            console.error("error in find-all-extra-charges: ", error);
            handleError(error, "while getting all extra-charges");
        }
    }

    async findOne(id: number) {
        try {
            const extraCharge = await this.extraChargeRepo.findOne({
                where: { id },
            });
            if (!extraCharge) {
                throw new NotFoundException("extraCharge was not found");
            }

            return extraCharge;
        } catch (error) {
            console.error("error in find-one-extraCharge: ", error);
            handleError(error, "while getting extraCharge");
        }
    }

    async update(id: number, dto: UpdateMasterExtraChargeDto) {
        const transaction = await this.queryService.createTransaction();
        try {
            await transaction.startTransaction();

            const updatedValue = await transaction.update(
                MasterExtraCharge,
                { id },
                {
                    ...dto,
                    updated_by: Number(getCurrentUser("user_id")),
                }
            );

            await transaction.commitTransaction();
            return updatedValue;
        } catch (error) {
            console.error("error in update-extra-charge: ", error);
            await transaction.rollbackTransaction();
            handleError(error, "while updating extra-charge");
        } finally {
            await transaction.release();
        }
    }

    async remove(id: number) {
        const transaction = await this.queryService.createTransaction();
        try {
            await transaction.startTransaction();

            await transaction.softDelete(
                MasterExtraCharge,
                { id },
                { deleted_by: Number(getCurrentUser("user_id")) }
            );

            await transaction.commitTransaction();
            return `extra-charge was deleted successfully`;
        } catch (error) {
            console.error("error in remove-extra-charge: ", error);
            await transaction.rollbackTransaction();
            handleError(error, "while deleting extra-charge");
        } finally {
            await transaction.release();
        }
    }
}
