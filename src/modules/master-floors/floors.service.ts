import {
    Inject,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from "@nestjs/common";
import { CreateMasterFloorDto } from "./dto/create-floor.dto";
import { UpdateFloorDto } from "./dto/update-floor.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { MasterFloor } from "./entities/master_floor.entity";
import { Repository } from "typeorm";
import { handleError } from "src/utils/handle-error.util";
import { GetFloorsDto } from "./dto/get-floors.dto";
import { paginationResponse } from "src/utils/pagination-response.util";
import { QueryManagerService } from "src/common/query-manager/query.service";
import { getCurrentUser } from "src/common/utils/user.util";

@Injectable()
export class FloorsService {
    constructor(
        @Inject() private readonly queryService: QueryManagerService,
        @InjectRepository(MasterFloor)
        private readonly floorRepo: Repository<MasterFloor>
    ) { }

    async createFloor(dto: CreateMasterFloorDto) {
        const transaction = await this.queryService.createTransaction();
        try {
            await transaction.startTransaction();

            const newFloor = new MasterFloor();
            Object.assign(newFloor, dto);
            newFloor.created_by = Number(getCurrentUser("user_id"));

            const res = await transaction.save(MasterFloor, newFloor);

            await transaction.commitTransaction();
            return res;
        } catch (error) {
            console.error("error in create-floor: ", error);
            await transaction.rollbackTransaction();
            handleError(error, "while creating floor");
        } finally {
            await transaction.release();
        }
    }

    async findAllFloors(dto: GetFloorsDto) {
        try {
            const { page_number = 1, limit, sbu_id } = dto;

            if (limit === undefined || limit === null) {
                const floorList = await this.floorRepo.find({
                    where: {
                        sbu_id: sbu_id
                    },
                    relations: ['building'],
                    order: {
                        id: "ASC",
                    },
                });

                return floorList;
            } else {
                const [floorList, total] = await this.floorRepo.findAndCount({
                    skip: (page_number - 1) * limit,
                    take: limit,
                    where: {
                        sbu_id: sbu_id
                    },
                    relations: ['building'],
                    order: {
                        id: "ASC",
                    },
                });

                return paginationResponse({
                    data: floorList,
                    total,
                    page: page_number,
                    limit,
                });
            }
        } catch (error) {
            console.error("error in find-all-floor: ", error);
            handleError(error, "while getting all floor");
        }
    }

    async findFloorById(floor_id: number) {
        try {
            const floor = await this.floorRepo.findOne({
                where: { id: floor_id },
            });
            if (!floor) {
                throw new NotFoundException("floor was not found");
            }

            return floor;
        } catch (error) {
            console.error("error in find-one-floor: ", error);
            handleError(error, "while getting floor");
        }
    }

    async updateFloor(floor_id: number, dto: UpdateFloorDto) {
        const transaction = await this.queryService.createTransaction();
        try {
            await transaction.startTransaction();

            const updatedFloor = await transaction.update(
                MasterFloor,
                { id: floor_id },
                {
                    ...dto,
                    updated_by: Number(getCurrentUser("user_id")),
                }
            );

            await transaction.commitTransaction();
            return updatedFloor;
        } catch (error) {
            console.error("error in update-floor: ", error);
            await transaction.rollbackTransaction();
            handleError(error, "while updating floor");
        } finally {
            await transaction.release();
        }
    }

    async removeFloor(floor_id: number) {
        const transaction = await this.queryService.createTransaction();
        try {
            await transaction.startTransaction();

            await transaction.softDelete(
                MasterFloor,
                { id: floor_id },
                { deleted_by: Number(getCurrentUser("user_id")) }
            );

            await transaction.commitTransaction();
            return `floor was deleted successfully`;
        } catch (error) {
            console.error("error in remove-floor: ", error);
            await transaction.rollbackTransaction();
            handleError(error, "while deleting floor");
        } finally {
            await transaction.release();
        }
    }
}
