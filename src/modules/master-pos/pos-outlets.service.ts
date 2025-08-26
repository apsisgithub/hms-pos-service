import {
    Inject,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PosOutlet } from "./entities/pos-outlet.entity";
import { QueryManagerService } from "src/common/query-manager/query.service";
import { handleError } from "src/utils/handle-error.util";
import { paginationResponse } from "src/utils/pagination-response.util";
import { getCurrentUser } from "src/common/utils/user.util";

@Injectable()
export class PosOutletsService {
    constructor(
        @Inject() private readonly queryService: QueryManagerService,
        @InjectRepository(PosOutlet)
        private readonly outletRepo: Repository<PosOutlet>
    ) { }

    async createOutlet(dto: any) {
        const transaction = await this.queryService.createTransaction();
        try {
            await transaction.startTransaction();

            const outletData = {
                ...dto,
                created_by: Number(getCurrentUser("user_id"))
            };

            const result = await transaction.save(PosOutlet, outletData);
            await transaction.commitTransaction();
            
            return result;
        } catch (error) {
            console.error("error in create-outlet: ", error);
            await transaction.rollbackTransaction();
            handleError(error, "while creating outlet");
        } finally {
            await transaction.release();
        }
    }

    async findAllOutlets(dto: any) {
        try {
            const { page_number = 1, limit } = dto;
            
            const queryBuilder = this.outletRepo.createQueryBuilder('outlet')
                .orderBy('outlet.id', 'ASC');

            if (dto.search) {
                queryBuilder.where('outlet.name LIKE :search OR outlet.location LIKE :search', {
                    search: `%${dto.search}%`
                });
            }

            if (limit === undefined || limit === null) {
                const outletList = await queryBuilder.getMany();

                if (outletList.length === 0) {
                    throw new NotFoundException("outlet list is empty");
                }
                return outletList;
            } else {
                const [outletList, total] = await queryBuilder
                    .skip((page_number - 1) * limit)
                    .take(limit)
                    .getManyAndCount();

                if (outletList.length === 0) {
                    throw new NotFoundException("outlet list is empty");
                }

                return paginationResponse({
                    data: outletList,
                    total,
                    page: page_number,
                    limit,
                });
            }
        } catch (error) {
            console.error("error in find-all-outlets: ", error);
            handleError(error, "while getting all outlets");
        }
    }

    async findOutletById(outlet_id: number) {
        try {
            const outlet = await this.outletRepo.findOne({
                where: { id: outlet_id },
                relations: ['tables', 'menu_items']
            });
            if (!outlet) {
                throw new NotFoundException("outlet was not found");
            }

            return outlet;
        } catch (error) {
            console.error("error in find-one-outlet: ", error);
            handleError(error, "while getting outlet");
        }
    }

    async updateOutlet(outlet_id: number, dto: any) {
        const transaction = await this.queryService.createTransaction();

        try {
            await transaction.startTransaction();

            const updatedOutlet = await transaction.update(
                PosOutlet,
                { id: outlet_id },
                {
                    ...dto,
                    updated_by: Number(getCurrentUser("user_id")),
                }
            );

            await transaction.commitTransaction();

            return updatedOutlet;
        } catch (error) {
            console.error("error in update-outlet: ", error);
            await transaction.rollbackTransaction();
            handleError(error, "while updating outlet");
        } finally {
            await transaction.release();
        }
    }

    async removeOutlet(outlet_id: number) {
        const transaction = await this.queryService.createTransaction();

        try {
            await transaction.startTransaction();

            await transaction.softDelete(
                PosOutlet,
                { id: outlet_id },
                {
                    deleted_by: Number(getCurrentUser("user_id")),
                }
            );

            await transaction.commitTransaction();

            return `outlet was deleted successfully`;
        } catch (error) {
            console.error("error in remove-outlet: ", error);
            await transaction.rollbackTransaction();
            handleError(error, "while deleting outlet");
        } finally {
            await transaction.release();
        }
    }
}