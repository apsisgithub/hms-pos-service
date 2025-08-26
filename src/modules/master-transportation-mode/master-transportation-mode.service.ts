import {
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    Inject,
} from "@nestjs/common";
import { CreateMasterTransportationModeDto } from "./dto/create-master-transportation-mode.dto";
import { UpdateMasterTransportationModeDto } from "./dto/update-master-transportation-mode.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { MasterTransportationMode } from "./entities/master_transportation_mode.entity";
import { Repository } from "typeorm";
import { handleError } from "src/utils/handle-error.util";
import { QueryManagerService } from "src/common/query-manager/query.service";
import { GetTransportationModesDto } from "./dto/get-transportation-modes.dto";
import { paginationResponse } from "src/utils/pagination-response.util";
import { getCurrentUser } from "src/common/utils/user.util";

@Injectable()
export class MasterTransportationModeService {
    constructor(
        @Inject() private readonly queryService: QueryManagerService,
        @InjectRepository(MasterTransportationMode)
        private readonly transportationModeRepo: Repository<MasterTransportationMode>
    ) {}

    async createTransportationMode(dto: CreateMasterTransportationModeDto) {
        const transaction = await this.queryService.createTransaction();
        try {
            await transaction.startTransaction();

            const newTransportationMode = new MasterTransportationMode();
            Object.assign(newTransportationMode, dto);
            newTransportationMode.created_by = Number(
                getCurrentUser("user_id")
            );

            const res = await transaction.save(
                MasterTransportationMode,
                newTransportationMode
            );
            if (!res) {
                throw new InternalServerErrorException(
                    "cannot create transportationMode"
                );
            }

            await transaction.commitTransaction();
            return res;
        } catch (error) {
            console.error("error in create-transportationMode: ", error);
            await transaction.rollbackTransaction();
            handleError(error, "while creating transportationMode");
        } finally {
            await transaction.release();
        }
    }

    async findAllTransportationModes(dto: GetTransportationModesDto) {
        try {
            const { page_number = 1, limit, sbu_id } = dto;

            if (limit === undefined || limit === null) {
                const transportationModeList =
                    await this.transportationModeRepo.find({
                        order: {
                            id: "ASC",
                        },
                        where: { sbu_id },
                    });

                return transportationModeList;
            } else {
                const [transportationModeList, total] =
                    await this.transportationModeRepo.findAndCount({
                        skip: (page_number - 1) * limit,
                        take: limit,
                        order: {
                            id: "ASC",
                        },
                    });

                return paginationResponse({
                    data: transportationModeList,
                    total,
                    page: page_number,
                    limit,
                });
            }
        } catch (error) {
            console.error("error in find-all-transportationMode: ", error);
            handleError(error, "while getting all transportationMode");
        }
    }

    async findTransportationModeById(transportation_mode_id: number) {
        try {
            const transportationMode =
                await this.transportationModeRepo.findOne({
                    where: { id: transportation_mode_id },
                });
            if (!transportationMode) {
                throw new NotFoundException("transportationMode was not found");
            }

            return transportationMode;
        } catch (error) {
            console.error("error in find-one-transportationMode: ", error);
            handleError(error, "while getting transportationMode");
        }
    }

    async updateTransportationMode(
        transportation_mode_id: number,
        dto: UpdateMasterTransportationModeDto
    ) {
        const transaction = await this.queryService.createTransaction();
        try {
            await transaction.startTransaction();

            const updatedTransportationMode = await transaction.update(
                MasterTransportationMode,
                { id: transportation_mode_id },
                {
                    ...dto,
                    updated_by: Number(getCurrentUser("user_id")),
                }
            );

            await transaction.commitTransaction();
            return updatedTransportationMode;
        } catch (error) {
            console.error("error in update-transportationMode: ", error);
            await transaction.rollbackTransaction();
            handleError(error, "while updating transportationMode");
        } finally {
            await transaction.release();
        }
    }

    async removeTransportationMode(transportation_mode_id: number) {
        const transaction = await this.queryService.createTransaction();
        try {
            await transaction.startTransaction();

            await transaction.softDelete(
                MasterTransportationMode,
                { id: transportation_mode_id },
                { deleted_by: Number(getCurrentUser("user_id")) }
            );

            await transaction.commitTransaction();
            return `transportationMode was deleted successfully`;
        } catch (error) {
            console.error("error in remove-transportationMode: ", error);
            await transaction.rollbackTransaction();
            handleError(error, "while deleting transportationMode");
        } finally {
            await transaction.release();
        }
    }
}
