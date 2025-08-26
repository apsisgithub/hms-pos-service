import {
    Inject,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from "@nestjs/common";
import { CreateMasterRateTypeDto } from "./dto/create-master-rate-type.dto";
import { UpdateMasterRateTypeDto } from "./dto/update-master-rate-type.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { MasterRateType } from "./entities/master_rate_type.entity";
import { DataSource, Repository } from "typeorm";
import { handleError } from "src/utils/handle-error.util";
import { QueryManagerService } from "src/common/query-manager/query.service";
import { GetRateTypesDto } from "./dto/get-rate-types.dto";
import { paginationResponse } from "src/utils/pagination-response.util";
import { getCurrentUser } from "src/common/utils/user.util";
import { MasterRoomTypeRate } from "./entities/master_room_type_rates.entity";
import { RateTypeResponse } from "./interfaces/rate-type.interface";

@Injectable()
export class MasterRateTypesService {
    constructor(
        @Inject() private readonly queryService: QueryManagerService,
        @InjectRepository(MasterRateType)
        private readonly rateTypeRepo: Repository<MasterRateType>,
        private readonly dataSource: DataSource
    ) {}

    async createRateType(dto: CreateMasterRateTypeDto) {
        const transaction = await this.queryService.createTransaction();
        try {
            await transaction.startTransaction();

            const newRateType = new MasterRateType();
            Object.assign(newRateType, dto);
            newRateType.created_by = Number(getCurrentUser("user_id"));

            const res: any = await transaction.save(
                MasterRateType,
                newRateType
            );

            const room_type_rates: any = [];
            for (let room_type_rate of dto.room_type_rates) {
                const newRoomTypeRate = {
                    ...room_type_rate,
                    rate_type_id: res.id,
                    created_by: Number(getCurrentUser("user_id")),
                };
                room_type_rates.push(newRoomTypeRate);
            }

            await transaction.save(MasterRoomTypeRate, room_type_rates);
            await transaction.commitTransaction();

            return res;
        } catch (error) {
            console.error("error in create-rateType: ", error);
            await transaction.rollbackTransaction();
            handleError(error, "while creating rateType");
        } finally {
            await transaction.release();
        }
    }

    async findAllRateTypes(dto: GetRateTypesDto & { room_type_id?: number }) {
        try {
            const { sbu_id, room_type_id } = dto;

            let query = `
            SELECT 
                rt.id AS rate_type_id,
                rt.sbu_id,
                rt.name,
                rt.short_code,
                rt.is_tax_included,
                rtr.room_type_id,
                rtr.rack_rate,
                rtr.extra_child_rate,
                rtr.extra_adult_rate,
                rtr.status,
                rm.name AS room_name,
                rm.short_name AS room_short_name
            FROM master_rate_types rt
            LEFT JOIN master_room_type_rates rtr ON rtr.rate_type_id = rt.id
            LEFT JOIN master_room_types rm ON rm.id = rtr.room_type_id
            WHERE rt.sbu_id = ?
            AND rt.deleted_at IS NULL
            AND rt.status = 'Active'
        `;

            const params: any[] = [sbu_id];

            if (room_type_id !== undefined) {
                query += ` AND rtr.room_type_id = ?`;
                params.push(room_type_id);
            }

            query += ` ORDER BY rt.id ASC`;

            const rawResult = await this.dataSource.query(query, params);

            const groupedData = this.groupRateTypesData(
                rawResult,
                room_type_id
            );

            return paginationResponse({
                data: groupedData,
                total: groupedData.length,
                page: 1,
                limit: groupedData.length,
            });
        } catch (error) {
            console.error("Error in findAllRateTypes:", error);
            handleError(error, "while getting all rate types");
        }
    }

    groupRateTypesData(rawData: any[], filterRoomTypeId?: number) {
        const map = new Map();

        for (const row of rawData) {
            if (!map.has(row.rate_type_id)) {
                map.set(row.rate_type_id, {
                    id: row.rate_type_id,
                    sbu_id: row.sbu_id,
                    name: row.name,
                    short_code: row.short_code,
                    is_tax_included: row.is_tax_included,
                    room_type_rates: [],
                });
            }

            if (
                row.room_type_id !== null &&
                (!filterRoomTypeId || row.room_type_id === filterRoomTypeId)
            ) {
                map.get(row.rate_type_id).room_type_rates.push({
                    room_type_id: row.room_type_id,
                    rack_rate: row.rack_rate,
                    extra_child_rate: row.extra_child_rate,
                    extra_adult_rate: row.extra_adult_rate,
                    status: row.status,
                    room_name: row.room_name,
                    short_name: row.short_name,
                });
            }
        }

        return Array.from(map.values());
    }

    async findRateTypeById(rate_type_id: number) {
        try {
            const query = `
            SELECT 
                rt.id AS rate_type_id,
                rt.sbu_id,
                rt.name,
                rt.short_code,
                rt.is_tax_included,
                rtr.room_type_id,
                rtr.rack_rate,
                rtr.extra_child_rate,
                rtr.extra_adult_rate,
                rtr.status,
                rm.name AS room_name,
                rm.short_name AS room_short_name
            FROM master_rate_types rt
            LEFT JOIN master_room_type_rates rtr ON rtr.rate_type_id = rt.id
            LEFT JOIN master_room_types rm ON rm.id = rtr.room_type_id
            WHERE rt.id = ?
        `;

            const result = await this.dataSource.query(query, [rate_type_id]);

            if (result.length === 0) {
                throw new NotFoundException("Rate type not found");
            }

            const base: RateTypeResponse = {
                id: result[0].rate_type_id,
                sbu_id: result[0].sbu_id,
                name: result[0].name,
                short_code: result[0].short_code,
                is_tax_included: !!result[0].is_tax_included,
                room_type_rates: [],
            };

            for (const row of result) {
                if (row.room_type_id) {
                    base.room_type_rates.push({
                        room_type_id: row.room_type_id,
                        rack_rate: row.rack_rate,
                        extra_child_rate: row.extra_child_rate,
                        extra_adult_rate: row.extra_adult_rate,
                        status: row.status,
                        room_name: row.room_name,
                        short_name: row.room_short_name,
                    });
                }
            }

            return base;
        } catch (error) {
            console.error("Error in findRateTypeById:", error);
            handleError(error, "while getting rateType");
        }
    }

    async updateRateType(rate_type_id: number, dto: UpdateMasterRateTypeDto) {
        const transaction = await this.queryService.createTransaction();
        try {
            await transaction.startTransaction();

            // Update the main MasterRateType table
            const { room_type_rates, ...rateTypeData } = dto;

            await transaction.update(
                MasterRateType,
                { id: rate_type_id },
                {
                    ...rateTypeData,
                    updated_by: Number(getCurrentUser("user_id")),
                }
            );

            if (room_type_rates && room_type_rates.length > 0) {
                const currentUserId = Number(getCurrentUser("user_id"));

                const updatePromises = room_type_rates.map((room_type_rate) => {
                    const { room_type_id, ...updateData } = room_type_rate;

                    return transaction.update(
                        MasterRoomTypeRate,
                        {
                            rate_type_id: rate_type_id,
                            room_type_id: room_type_id,
                        },
                        {
                            ...updateData,
                            updated_by: currentUserId,
                            updated_at: new Date(),
                        }
                    );
                });

                // Execute all updates concurrently
                await Promise.all(updatePromises);
            }

            await transaction.commitTransaction();

            return `updated successfully`;
        } catch (error) {
            console.error("error in update-rateType: ", error);
            await transaction.rollbackTransaction();
            handleError(error, "while updating rateType");
        } finally {
            await transaction.release();
        }
    }

    async removeRateType(rate_type_id: number) {
        const transaction = await this.queryService.createTransaction();
        try {
            await transaction.startTransaction();

            await transaction.softDelete(
                MasterRateType,
                { id: rate_type_id },
                { deleted_by: Number(getCurrentUser("user_id")) }
            );

            await transaction.commitTransaction();
            return `rateType was deleted successfully`;
        } catch (error) {
            console.error("error in remove-rateType: ", error);
            await transaction.rollbackTransaction();
            handleError(error, "while deleting rateType");
        } finally {
            await transaction.release();
        }
    }
}
