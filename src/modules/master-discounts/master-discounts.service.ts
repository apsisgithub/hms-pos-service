import {
    Inject,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from "@nestjs/common";
import { CreateMasterDiscountDto } from "./dto/create-master-discount.dto";
import { UpdateMasterDiscountDto } from "./dto/update-master-discount.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { MasterDiscount } from "./entities/master_discount.entity";
import { Repository } from "typeorm";
import { handleError } from "src/utils/handle-error.util";
import { QueryManagerService } from "src/common/query-manager/query.service";
import { GetDiscountsDto } from "./dto/get-discounts.dto";
import { paginationResponse } from "src/utils/pagination-response.util";
import { getCurrentUser } from "src/common/utils/user.util";

@Injectable()
export class MasterDiscountsService {
    constructor(
        @Inject() private readonly queryService: QueryManagerService,
        @InjectRepository(MasterDiscount)
        private readonly discountRepo: Repository<MasterDiscount>
    ) {}

    async createDiscount(dto: CreateMasterDiscountDto) {
        const transaction = await this.queryService.createTransaction();
        try {
            await transaction.startTransaction();

            const newDiscount = new MasterDiscount();
            Object.assign(newDiscount, dto);
            newDiscount.created_by = Number(getCurrentUser("user_id"));

            const res = await transaction.save(MasterDiscount, newDiscount);
            if (!res) {
                throw new InternalServerErrorException(
                    "cannot create discount"
                );
            }

            await transaction.commitTransaction();
            return res;
        } catch (error) {
            console.error("error in create-discount: ", error);
            await transaction.rollbackTransaction();
            handleError(error, "while creating discount");
        } finally {
            await transaction.release();
        }
    }

    async findAllDiscounts(dto: GetDiscountsDto) {
        try {
            const { page_number = 1, limit, sbu_id } = dto;

            if (limit === undefined || limit === null) {
                const discountList = await this.discountRepo.find({
                    order: {
                        id: "ASC",
                    },
                    where: { sbu_id },
                });

                return discountList;
            } else {
                const [discountList, total] =
                    await this.discountRepo.findAndCount({
                        skip: (page_number - 1) * limit,
                        take: limit,
                        order: {
                            id: "ASC",
                        },
                        where: { sbu_id },
                    });

                return paginationResponse({
                    data: discountList,
                    total,
                    page: page_number,
                    limit,
                });
            }
        } catch (error) {
            console.error("error in find-all-discount: ", error);
            handleError(error, "while getting all discount");
        }
    }

    async findDiscountById(id: number) {
        try {
            const discount = await this.discountRepo.findOne({
                where: { id },
            });
            if (!discount) {
                throw new NotFoundException("discount was not found");
            }

            return discount;
        } catch (error) {
            console.error("error in find-one-discount: ", error);
            handleError(error, "while getting discount");
        }
    }

    async updateDiscount(id: number, dto: UpdateMasterDiscountDto) {
        const transaction = await this.queryService.createTransaction();
        try {
            await transaction.startTransaction();

            const updatedDiscount = await transaction.update(
                MasterDiscount,
                { id },
                {
                    ...dto,
                    updated_by: Number(getCurrentUser("user_id")),
                }
            );

            await transaction.commitTransaction();
            return updatedDiscount;
        } catch (error) {
            console.error("error in update-discount: ", error);
            await transaction.rollbackTransaction();
            handleError(error, "while updating discount");
        } finally {
            await transaction.release();
        }
    }

    async removeDiscount(id: number) {
        const transaction = await this.queryService.createTransaction();
        try {
            await transaction.startTransaction();

            await transaction.softDelete(
                MasterDiscount,
                { id },
                { deleted_by: Number(getCurrentUser("user_id")) }
            );

            await transaction.commitTransaction();
            return `discount was deleted successfully`;
        } catch (error) {
            console.error("error in remove-discount: ", error);
            await transaction.rollbackTransaction();
            handleError(error, "while deleting discount");
        } finally {
            await transaction.release();
        }
    }
}
