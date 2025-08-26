import {
    Inject,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PosTable } from "./entities/pos-table.entity";
import { QueryManagerService } from "src/common/query-manager/query.service";
import { handleError } from "src/utils/handle-error.util";
import { paginationResponse } from "src/utils/pagination-response.util";
import { getCurrentUser } from "src/common/utils/user.util";

@Injectable()
export class PosTablesService {
    constructor(
        @Inject() private readonly queryService: QueryManagerService,
        @InjectRepository(PosTable)
        private readonly tableRepo: Repository<PosTable>
    ) {}

    async createTable(dto: any) {
        const transaction = await this.queryService.createTransaction();
        try {
            await transaction.startTransaction();

            const tableData = {
                ...dto,
                created_by: Number(getCurrentUser("user_id"))
            };

            const result = await transaction.save(PosTable, tableData);
            await transaction.commitTransaction();
            
            return result;
        } catch (error) {
            console.error("error in create-table: ", error);
            await transaction.rollbackTransaction();
            handleError(error, "while creating table");
        } finally {
            await transaction.release();
        }
    }

    async findAllTables(dto: any) {
        try {
            const { page_number = 1, limit } = dto;
            
            const queryBuilder = this.tableRepo.createQueryBuilder('table')
                .leftJoinAndSelect('table.outlet', 'outlet')
                .orderBy('table.id', 'ASC');
            
            if (dto.outlet_id) {
                queryBuilder.where('table.outlet_id = :outlet_id', { outlet_id: dto.outlet_id });
            }

            if (dto.status) {
                queryBuilder.andWhere('table.status = :status', { status: dto.status });
            }

            if (dto.search) {
                queryBuilder.andWhere('table.table_name LIKE :search OR table.table_short_code LIKE :search', {
                    search: `%${dto.search}%`
                });
            }

            if (limit === undefined || limit === null) {
                const tableList = await queryBuilder.getMany();

                if (tableList.length === 0) {
                    throw new NotFoundException("table list is empty");
                }
                return tableList;
            } else {
                const [tableList, total] = await queryBuilder
                    .skip((page_number - 1) * limit)
                    .take(limit)
                    .getManyAndCount();

                if (tableList.length === 0) {
                    throw new NotFoundException("table list is empty");
                }

                return paginationResponse({
                    data: tableList,
                    total,
                    page: page_number,
                    limit,
                });
            }
        } catch (error) {
            console.error("error in find-all-tables: ", error);
            handleError(error, "while getting all tables");
        }
    }

    async findTableById(table_id: number) {
        try {
            const table = await this.tableRepo.findOne({
                where: { id: table_id },
                relations: ['outlet']
            });
            if (!table) {
                throw new NotFoundException("table was not found");
            }

            return table;
        } catch (error) {
            console.error("error in find-one-table: ", error);
            handleError(error, "while getting table");
        }
    }

    async updateTable(table_id: number, dto: any) {
        const transaction = await this.queryService.createTransaction();

        try {
            await transaction.startTransaction();

            const updatedTable = await transaction.update(
                PosTable,
                { id: table_id },
                {
                    ...dto,
                    updated_by: Number(getCurrentUser("user_id")),
                }
            );

            await transaction.commitTransaction();

            return updatedTable;
        } catch (error) {
            console.error("error in update-table: ", error);
            await transaction.rollbackTransaction();
            handleError(error, "while updating table");
        } finally {
            await transaction.release();
        }
    }

    async removeTable(table_id: number) {
        const transaction = await this.queryService.createTransaction();

        try {
            await transaction.startTransaction();

            await transaction.softDelete(
                PosTable,
                { id: table_id },
                {
                    deleted_by: Number(getCurrentUser("user_id")),
                }
            );

            await transaction.commitTransaction();

            return `table was deleted successfully`;
        } catch (error) {
            console.error("error in remove-table: ", error);
            await transaction.rollbackTransaction();
            handleError(error, "while deleting table");
        } finally {
            await transaction.release();
        }
    }
}