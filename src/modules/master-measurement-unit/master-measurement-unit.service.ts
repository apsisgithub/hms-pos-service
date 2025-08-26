import {
    Inject,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from "@nestjs/common";
import { CreateMasterMeasurementUnitDto } from "./dto/create-master-measurement-unit.dto";
import { UpdateMasterMeasurementUnitDto } from "./dto/update-master-measurement-unit.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { MasterMeasurementUnit } from "./entities/master_measurement_unit.entity";
import { Repository } from "typeorm";
import { handleError } from "src/utils/handle-error.util";
import { QueryManagerService } from "src/common/query-manager/query.service";
import { GetMeasurementUnitsDto } from "./dto/get-measurement-units.dto";
import { paginationResponse } from "src/utils/pagination-response.util";
import { getCurrentUser } from "src/common/utils/user.util";

@Injectable()
export class MasterMeasurementUnitService {
    constructor(
        @Inject() private readonly queryService: QueryManagerService,
        @InjectRepository(MasterMeasurementUnit)
        private readonly measurementRepo: Repository<MasterMeasurementUnit>
    ) {}

    async createMeasurementUnit(dto: CreateMasterMeasurementUnitDto) {
        const transaction = await this.queryService.createTransaction();
        try {
            await transaction.startTransaction();

            const newMeasurementUnit = new MasterMeasurementUnit();
            Object.assign(newMeasurementUnit, dto);
            newMeasurementUnit.created_by = Number(getCurrentUser("user_id"));

            const res = await transaction.save(
                MasterMeasurementUnit,
                newMeasurementUnit
            );

            await transaction.commitTransaction();
            return res;
        } catch (error) {
            console.error("error in create-measurementUnit: ", error);
            await transaction.rollbackTransaction();
            handleError(error, "while creating measurementUnit");
        } finally {
            await transaction.release();
        }
    }

    async findAllMeasurementUnits(dto: GetMeasurementUnitsDto) {
        try {
            const { page_number = 1, limit, sbu_id } = dto;

            if (limit === undefined || limit === null) {
                const measurementUnitList = await this.measurementRepo.find({
                    order: {
                        id: "ASC",
                    },
                    where: { sbu_id },
                });

                return measurementUnitList;
            } else {
                const [measurementUnitList, total] =
                    await this.measurementRepo.findAndCount({
                        skip: (page_number - 1) * limit,
                        take: limit,
                        order: {
                            id: "ASC",
                        },
                        where: { sbu_id },
                    });

                return paginationResponse({
                    data: measurementUnitList,
                    total,
                    page: page_number,
                    limit,
                });
            }
        } catch (error) {
            console.error("error in find-all-measurementUnit: ", error);
            handleError(error, "while getting all measurementUnit");
        }
    }

    async findMeasurementUnitById(id: number) {
        try {
            const measurementUnit = await this.measurementRepo.findOne({
                where: { id },
            });
            if (!measurementUnit) {
                throw new NotFoundException("measurementUnit was not found");
            }

            return measurementUnit;
        } catch (error) {
            console.error("error in find-one-measurementUnit: ", error);
            handleError(error, "while getting measurementUnit");
        }
    }

    async updateMeasurementUnit(
        id: number,
        dto: UpdateMasterMeasurementUnitDto
    ) {
        const transaction = await this.queryService.createTransaction();
        try {
            await transaction.startTransaction();

            const updatedMeasurementUnit = await transaction.update(
                MasterMeasurementUnit,
                { id },
                {
                    ...dto,
                    updated_by: Number(getCurrentUser("user_id")),
                }
            );

            await transaction.commitTransaction();
            return updatedMeasurementUnit;
        } catch (error) {
            console.error("error in update-measurementUnit: ", error);
            await transaction.rollbackTransaction();
            handleError(error, "while updating measurementUnit");
        } finally {
            await transaction.release();
        }
    }

    async removeMeasurementUnit(id: number) {
        const transaction = await this.queryService.createTransaction();
        try {
            await transaction.startTransaction();

            await transaction.softDelete(
                MasterMeasurementUnit,
                { id },
                { deleted_by: Number(getCurrentUser("user_id")) }
            );

            await transaction.commitTransaction();
            return `measurementUnit was deleted successfully`;
        } catch (error) {
            console.error("error in remove-measurementUnit: ", error);
            await transaction.rollbackTransaction();
            handleError(error, "while deleting measurementUnit");
        } finally {
            await transaction.release();
        }
    }
}
