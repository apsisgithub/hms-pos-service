import {
    Inject,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from "@nestjs/common";
import { CreateMasterBuildingDto } from "./dto/create-building.dto";
import { UpdateBuildingDto } from "./dto/update-building.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { MasterBuilding } from "./entities/master_building.entity";
import { Repository } from "typeorm";
import { handleError } from "src/utils/handle-error.util";
import { GetBuildingsDto } from "./dto/get-buildings.dto";
import { paginationResponse } from "src/utils/pagination-response.util";
import { QueryManagerService } from "src/common/query-manager/query.service";
import { getCurrentUser } from "src/common/utils/user.util";

@Injectable()
export class BuildingsService {
    constructor(
        @Inject() private readonly queryService: QueryManagerService,
        @InjectRepository(MasterBuilding)
        private readonly buildingRepo: Repository<MasterBuilding>
    ) {}

    async createBuilding(dto: CreateMasterBuildingDto) {
        const transaction = await this.queryService.createTransaction();
        try {
            await transaction.startTransaction();

            const buildingData = {
                ...dto,
                created_by: Number(getCurrentUser("user_id")),
            };

            const result = await transaction.save(MasterBuilding, buildingData);
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

    async findAllBuildings(dto: GetBuildingsDto) {
        try {
            const { page_number = 1, limit, sbu_id } = dto;

            const qb = this.buildingRepo
                .createQueryBuilder("building")
                .leftJoin("master_sbu", "sbu", "sbu.id = building.sbu_id")
                .select([
                    "building.id AS id",
                    "building.name AS name",
                    "building.description AS description",
                    "building.status AS status",
                    "building.sbu_id AS sbu_id",
                    "sbu.name AS sbu_name",
                ])
                .orderBy("building.id", "ASC");

            if (sbu_id) {
                qb.andWhere("building.sbu_id = :sbu_id", { sbu_id });
            }

            if (limit === undefined || limit === null) {
                const result = await qb.getRawMany();

                return result.map((row) => ({
                    id: row.id,
                    name: row.name,
                    description: row.description,
                    status: row.status,
                    sbu_id: row.sbu_id,
                    sbu_name: row.sbu_name,
                }));
            } else {
                qb.skip((page_number - 1) * limit).take(limit);

                const [result, total] = await Promise.all([
                    qb.getRawMany(),
                    qb.getCount(),
                ]);

                const formatted = result.map((row) => ({
                    id: row.id,
                    name: row.name,
                    status: row.status,
                    sbu_id: row.sbu_id,
                    description: row.description,
                    sbu_name: row.sbu_name,
                }));

                return paginationResponse({
                    data: formatted,
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

    async findBuildingById(building_id: number) {
        try {
            const building = await this.buildingRepo.findOne({
                where: { id: building_id },
            });
            if (!building) {
                throw new NotFoundException("building was not found");
            }

            return building;
        } catch (error) {
            console.error("error in find-one-building: ", error);
            handleError(error, "while getting building");
        }
    }

    async updatebuilding(building_id: number, dto: UpdateBuildingDto) {
        const transaction = await this.queryService.createTransaction();

        try {
            await transaction.startTransaction();

            const updatedBuilding = await transaction.update(
                MasterBuilding,
                { id: building_id },
                {
                    ...dto,
                    updated_by: Number(getCurrentUser("user_id")),
                }
            );

            await transaction.commitTransaction();

            return updatedBuilding;
        } catch (error) {
            console.error("error in update-building: ", error);
            await transaction.rollbackTransaction();
            handleError(error, "while updating building");
        } finally {
            await transaction.release();
        }
    }

    async removebuilding(building_id: number) {
        const transaction = await this.queryService.createTransaction();

        try {
            await transaction.startTransaction();

            await transaction.softDelete(
                MasterBuilding,
                { id: building_id },
                {
                    deleted_by: Number(getCurrentUser("user_id")),
                }
            );

            await transaction.commitTransaction();

            return `building was deleted successfully`;
        } catch (error) {
            console.error("error in remove-building: ", error);
            await transaction.rollbackTransaction();
            handleError(error, "while deleting building");
        } finally {
            await transaction.release();
        }
    }
}
