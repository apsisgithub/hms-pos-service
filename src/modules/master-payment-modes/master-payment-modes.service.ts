import {
    Inject,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from "@nestjs/common";
import { CreateMasterPaymentModeDto } from "./dto/create-master-payment-mode.dto";
import { UpdateMasterPaymentModeDto } from "./dto/update-master-payment-mode.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { MasterPaymentMode } from "./entities/master_payment_modes.entity";
import { Repository } from "typeorm";
import { handleError } from "src/utils/handle-error.util";
import { QueryManagerService } from "src/common/query-manager/query.service";
import { GetPaymentModesDto } from "./dto/get-payment-modes.dto";
import { paginationResponse } from "src/utils/pagination-response.util";
import { getCurrentUser } from "src/common/utils/user.util";

export enum PaymentModes  {
    Cash = 1,
    Bank = 2,
    CityLedger = 3,
    Online = 4

}


@Injectable()
export class MasterPaymentModesService {
    constructor(
        @Inject() private readonly queryService: QueryManagerService,
        @InjectRepository(MasterPaymentMode)
        private readonly paymentModeRepo: Repository<MasterPaymentMode>
    ) {}

    async createPaymentMode(dto: CreateMasterPaymentModeDto) {
        const transaction = await this.queryService.createTransaction();
        try {
            await transaction.startTransaction();

            const newPaymentMode = new MasterPaymentMode();
            Object.assign(newPaymentMode, dto);
            newPaymentMode.created_by = Number(getCurrentUser("user_id"));

            const res = await transaction.save(
                MasterPaymentMode,
                newPaymentMode
            );

            await transaction.commitTransaction();
            return res;
        } catch (error) {
            console.error("error in create-paymentMode: ", error);
            await transaction.rollbackTransaction();
            handleError(error, "while creating paymentMode");
        } finally {
            await transaction.release();
        }
    }

    async findAllPaymentModes(dto: GetPaymentModesDto) {
        try {
            const { page_number = 1, limit } = dto;

            if (limit === undefined || limit === null) {
                const paymentModeList = await this.paymentModeRepo.find({
                    order: {
                        id: "ASC",
                    },
                    
                });

                return paymentModeList;
            } else {
                const [paymentModeList, total] =
                    await this.paymentModeRepo.findAndCount({
                        skip: (page_number - 1) * limit,
                        take: limit,
                        order: {
                            id: "ASC",
                        },
                       
                    });

                return paginationResponse({
                    data: paymentModeList,
                    total,
                    page: page_number,
                    limit,
                });
            }
        } catch (error) {
            console.error("error in find-all-paymentMode: ", error);
            handleError(error, "while getting all paymentMode");
        }
    }

    async findPaymentModeById(id: number) {
        try {
            const paymentMode = await this.paymentModeRepo.findOne({
                where: { id },
            });
            if (!paymentMode) {
                throw new NotFoundException("paymentMode was not found");
            }

            return paymentMode;
        } catch (error) {
            console.error("error in find-one-paymentMode: ", error);
            handleError(error, "while getting paymentMode");
        }
    }

    async updatePaymentMode(id: number, dto: UpdateMasterPaymentModeDto) {
        const transaction = await this.queryService.createTransaction();
        try {
            await transaction.startTransaction();

            const updatedPaymentMode = await transaction.update(
                MasterPaymentMode,
                { id },
                {
                    ...dto,
                    updated_by: Number(getCurrentUser("user_id")),
                }
            );

            await transaction.commitTransaction();
            return updatedPaymentMode;
        } catch (error) {
            console.error("error in update-paymentMode: ", error);
            await transaction.rollbackTransaction();
            handleError(error, "while updating paymentMode");
        } finally {
            await transaction.release();
        }
    }

    async removePaymentMode(id: number) {
        const transaction = await this.queryService.createTransaction();
        try {
            await transaction.startTransaction();

            await transaction.softDelete(
                MasterPaymentMode,
                { id },
                { deleted_by: Number(getCurrentUser("user_id")) }
            );

            await transaction.commitTransaction();
            return `paymentMode was deleted successfully`;
        } catch (error) {
            console.error("error in remove-paymentMode: ", error);
            await transaction.rollbackTransaction();
            handleError(error, "while deleting paymentMode");
        } finally {
            await transaction.release();
        }
    }
}
