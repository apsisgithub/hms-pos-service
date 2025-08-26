import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { CreateMasterBusinessAgentDto } from "./dto/create-master-business-agent.dto";
import { UpdateMasterBusinessAgentDto } from "./dto/update-master-business-agent.dto";
import { QueryManagerService } from "src/common/query-manager/query.service";
import { InjectRepository } from "@nestjs/typeorm";
import { MasterBusinessAgent } from "./entities/master-business-agent.entity";
import { Repository } from "typeorm";
import { getCurrentUser } from "src/common/utils/user.util";
import { handleError } from "src/utils/handle-error.util";
import { GetBusinessAgentsDto } from "./dto/get-business-agents.dto";
import { paginationResponse } from "src/utils/pagination-response.util";

@Injectable()
export class MasterBusinessAgentsService {
    constructor(
        @Inject() private readonly queryService: QueryManagerService,
        @InjectRepository(MasterBusinessAgent)
        private readonly businessAgentRepo: Repository<MasterBusinessAgent>
    ) {}

    async create(dto: CreateMasterBusinessAgentDto) {
        const transaction = await this.queryService.createTransaction();
        try {
            await transaction.startTransaction();

            const businessAgentsData = {
                ...dto,
                created_by: Number(getCurrentUser("user_id")),
            };

            const result = await transaction.save(
                MasterBusinessAgent,
                businessAgentsData
            );
            await transaction.commitTransaction();

            return result;
        } catch (error) {
            console.error("error in create-building: ", error);
            await transaction.rollbackTransaction();
            handleError(error, "while creating building");
        } finally {
            await transaction.release();
        }
    }

    async findAll(dto: GetBusinessAgentsDto) {
        try {
            const { page_number = 1, limit, sbu_id } = dto;

            if (limit === undefined || limit === null) {
                const businessAgentList = await this.businessAgentRepo.find({
                    order: {
                        id: "ASC",
                    },
                    where: { sbu_id },
                });

                return businessAgentList;
            } else {
                const [businessAgentList, total] =
                    await this.businessAgentRepo.findAndCount({
                        skip: (page_number - 1) * limit,
                        take: limit,
                        order: {
                            id: "ASC",
                        },
                        where: { sbu_id },
                    });

                return paginationResponse({
                    data: businessAgentList,
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
            const businessAgent = await this.businessAgentRepo.findOne({
                where: { id },
            });

            if (!businessAgent) {
                throw new NotFoundException("business-agent was not found");
            }

            return businessAgent;
        } catch (error) {
            console.error("error in find-one-business-agent: ", error);
            handleError(error, "while getting business-agent");
        }
    }

    async update(id: number, dto: UpdateMasterBusinessAgentDto) {
        const transaction = await this.queryService.createTransaction();

        try {
            await transaction.startTransaction();

            const updatedbusinessAgent = await transaction.update(
                MasterBusinessAgent,
                { id },
                {
                    ...dto,
                    updated_by: Number(getCurrentUser("user_id")),
                }
            );

            await transaction.commitTransaction();

            return updatedbusinessAgent;
        } catch (error) {
            console.error("error in update-business-agent: ", error);
            await transaction.rollbackTransaction();
            handleError(error, "while updating business-agent");
        } finally {
            await transaction.release();
        }
    }

    async remove(id: number) {
        const transaction = await this.queryService.createTransaction();

        try {
            await transaction.startTransaction();

            await transaction.softDelete(
                MasterBusinessAgent,
                { id },
                {
                    deleted_by: Number(getCurrentUser("user_id")),
                }
            );

            await transaction.commitTransaction();

            return `business-agent was deleted successfully`;
        } catch (error) {
            console.error("error in remove-business-agent: ", error);
            await transaction.rollbackTransaction();
            handleError(error, "while deleting business-agent");
        } finally {
            await transaction.release();
        }
    }
}
