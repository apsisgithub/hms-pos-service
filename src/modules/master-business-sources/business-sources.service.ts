import {
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    Inject,
} from "@nestjs/common";
import { CreateMasterBusinessSourceDto } from "./dto/create-business-source.dto";
import { UpdateBusinessSourceDto } from "./dto/update-business-source.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { MasterBusinessSource } from "./entities/master_business_sources.entity";
import { DataSource, Repository } from "typeorm";
import { handleError } from "src/utils/handle-error.util";
import { QueryManagerService } from "src/common/query-manager/query.service";
import { GetBusinessSourcesDto } from "./dto/get-buisiness-source.dto";
import { paginationResponse } from "src/utils/pagination-response.util";
import { getCurrentUser } from "src/common/utils/user.util";
import { CreateMarketCode } from "./dto/create-market-code.dto";
import { MasterMarketCode } from "./entities/master_market_code.entity";
import { IsObject } from "class-validator";
import { GetMarketCodeDto } from "./dto/get-market-code.dto";

@Injectable()
export class MasterBusinessSourceService {
    constructor(
        @Inject() private readonly queryService: QueryManagerService,
        @InjectRepository(MasterBusinessSource)
        private readonly businessSourceRepo: Repository<MasterBusinessSource>,
        private readonly dataSource: DataSource,
        @InjectRepository(MasterMarketCode)
        private readonly marketCodeRepo: Repository<MasterMarketCode>
    ) {}

    async createBusinessSource(dto: CreateMasterBusinessSourceDto) {
        const transaction = await this.queryService.createTransaction();
        try {
            await transaction.startTransaction();

            const newBusinessSource = new MasterBusinessSource();
            Object.assign(newBusinessSource, dto);
            newBusinessSource.created_by = Number(getCurrentUser("user_id"));

            const res = await transaction.save(
                MasterBusinessSource,
                newBusinessSource
            );

            await transaction.commitTransaction();
            return res;
        } catch (error) {
            console.error("error in create-businessSource: ", error);
            await transaction.rollbackTransaction();
            handleError(error, "while creating businessSource");
        } finally {
            await transaction.release();
        }
    }

    async findAllBusinessSources(dto: GetBusinessSourcesDto) {
        try {
            const { page_number = 1, limit, sbu_id } = dto;

            const baseQuery = `
            SELECT 
                mbs.id,
                mbs.short_code,
                mbs.name,
                mbs.color_code,
                mbs.status,
                mbs.market_code,
                mbs.registration_no,
                mbs.address,
                mbs.created_at,
                mbs.updated_at,

                cu.name AS created_by_name,
                uu.name AS updated_by_name
            FROM master_business_sources mbs
            LEFT JOIN master_users cu ON cu.id = mbs.created_by
            LEFT JOIN master_users uu ON uu.id = mbs.updated_by
            WHERE mbs.sbu_id = ?
            AND mbs.deleted_at IS NULL
            AND mbs.status = 'Active'
            ORDER BY mbs.id ASC
        `;

            if (limit === undefined || limit === null) {
                const result = await this.dataSource.query(baseQuery, [sbu_id]);
                return result;
            } else {
                const offset = (page_number - 1) * limit;

                const paginatedQuery = `
                ${baseQuery}
                LIMIT ? OFFSET ?
            `;

                const data = await this.dataSource.query(paginatedQuery, [
                    sbu_id,
                    Number(limit),
                    Number(offset),
                ]);

                const countQuery = `
                SELECT COUNT(*) AS total
                FROM master_business_sources mbs
                WHERE mbs.sbu_id = ?
                AND deleted_at IS NULL
                AND status = 'Active'
            `;
                const countResult = await this.dataSource.query(countQuery, [
                    sbu_id,
                ]);
                const total = Number(countResult[0]?.total || 0);

                return paginationResponse({
                    data,
                    total,
                    page: page_number,
                    limit,
                });
            }
        } catch (error) {
            console.error("error in find-all-businessSource-raw: ", error);
            handleError(error, "while getting all businessSource");
        }
    }

    async findBusinessSourceById(id: number) {
        try {
            const businessSource = await this.businessSourceRepo.findOne({
                where: { id },
            });
            if (!businessSource) {
                throw new NotFoundException("businessSource was not found");
            }

            return businessSource;
        } catch (error) {
            console.error("error in find-one-businessSource: ", error);
            handleError(error, "while getting businessSource");
        }
    }

    async updateBusinessSource(id: number, dto: UpdateBusinessSourceDto) {
        const transaction = await this.queryService.createTransaction();
        try {
            await transaction.startTransaction();

            const updatedBusinessSource = await transaction.update(
                MasterBusinessSource,
                { id },
                {
                    ...dto,
                    updated_by: Number(getCurrentUser("user_id")),
                }
            );

            await transaction.commitTransaction();
            return updatedBusinessSource;
        } catch (error) {
            console.error("error in update-businessSource: ", error);
            await transaction.rollbackTransaction();
            handleError(error, "while updating businessSource");
        } finally {
            await transaction.release();
        }
    }

    async removeBusinessSource(id: number) {
        const transaction = await this.queryService.createTransaction();
        try {
            await transaction.startTransaction();

            await transaction.softDelete(
                MasterBusinessSource,
                { id },
                {
                    deleted_by: Number(getCurrentUser("user_id")),
                }
            );

            await transaction.commitTransaction();
            return `businessSource was deleted successfully`;
        } catch (error) {
            console.error("error in remove-businessSource: ", error);
            await transaction.rollbackTransaction();
            handleError(error, "while deleting businessSource");
        } finally {
            await transaction.release();
        }
    }

    async createMarketCode(dto: CreateMarketCode) {
        const transaction = await this.queryService.createTransaction();
        try {
            await transaction.startTransaction();

            const newMarketCode = new MasterMarketCode();
            Object.assign(newMarketCode, dto);
            const res = await transaction.save(MasterMarketCode, newMarketCode);

            await transaction.commitTransaction();
            return res;
        } catch (error) {
            console.error("error in create-market-code: ", error);
            await transaction.rollbackTransaction();
            handleError(error);
        } finally {
            await transaction.release();
        }
    }

    async getAllMarketCodes(dto: GetMarketCodeDto) {
        try {
            const { page_number = 1, limit, sbu_id } = dto;

            if (limit === undefined || limit === null) {
                const marketCodes = await this.marketCodeRepo.find({
                    order: {
                        id: "ASC",
                    },
                    where: { sbu_id },
                });

                return marketCodes;
            } else {
                const [marketCodes, total] =
                    await this.marketCodeRepo.findAndCount({
                        skip: (page_number - 1) * limit,
                        take: limit,
                        order: {
                            id: "ASC",
                        },
                        where: { sbu_id },
                    });

                return paginationResponse({
                    data: marketCodes,
                    total,
                    page: page_number,
                    limit,
                });
            }
        } catch (error) {
            console.error("error in get-market-code: ", error);
            handleError(error);
        }
    }
}
