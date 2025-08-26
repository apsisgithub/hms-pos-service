import {
    Inject,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from "@nestjs/common";
import { CreateMasterRoomRateDto } from "./dto/create-master-room-rate.dto";
import { UpdateMasterRoomRateDto } from "./dto/update-master-room-rate.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { MasterRoomRate } from "./entities/master_room_rates.entity";
import { Repository } from "typeorm";
import { handleError } from "src/utils/handle-error.util";
import { QueryManagerService } from "src/common/query-manager/query.service";
import { GetRoomRatesDto } from "./dto/get-room-rates.dto"; // Added for pagination
import { paginationResponse } from "src/utils/pagination-response.util"; // Ensure this import path is correct
import { getCurrentUser } from "src/common/utils/user.util"; // Ensure this import path is correct

@Injectable()
export class MasterRoomRatesService {
    constructor(
        @Inject() private readonly queryService: QueryManagerService,
        @InjectRepository(MasterRoomRate)
        private readonly roomRateRepo: Repository<MasterRoomRate>
    ) {}

    async createroomRate(dto: CreateMasterRoomRateDto) {
        const transaction = await this.queryService.createTransaction();
        try {
            await transaction.startTransaction();

            const newRoomRate = new MasterRoomRate();
            Object.assign(newRoomRate, dto);
            newRoomRate.created_by = Number(getCurrentUser("user_id"));

            const res = await transaction.save(MasterRoomRate, newRoomRate);

            await transaction.commitTransaction();
            return res;
        } catch (error) {
            console.error("error in create-roomRate: ", error);
            await transaction.rollbackTransaction();
            handleError(error, "while creating roomRate");
        } finally {
            await transaction.release();
        }
    }

    async findAllRoomRates(dto: GetRoomRatesDto) {
        try {
            const { page_number = 1, limit, sbu_id } = dto;

            const baseQuery = `
            SELECT 
                r.id,
                r.sbu_id,
                r.room_type_id,
                r.rate_type_id,
                r.season_id,
                r.price,
                r.installment_count,
                r.extra_adult_price,
                r.extra_child_price,
                r.status,
                rt.name AS rate_type_name,
                rm.name AS room_type_name,
                s.season_name
            FROM 
                master_room_rates r
            LEFT JOIN 
                master_rate_types rt ON r.rate_type_id = rt.id
            LEFT JOIN 
                master_room_types rm ON r.room_type_id = rm.id
            LEFT JOIN 
                master_seasons s ON r.season_id = s.id
            WHERE 
                r.sbu_id = ?   
            AND r.deleted_at IS NULL
            ORDER BY 
                r.id ASC
        `;

            if (limit === undefined || limit === null) {
                const roomRateList = await this.roomRateRepo.query(baseQuery, [
                    sbu_id,
                ]);
                return roomRateList;
            } else {
                const paginatedQuery = `
                ${baseQuery}
                LIMIT ? OFFSET ?
            `;
                const offset = (page_number - 1) * limit;
                const roomRateList = await this.roomRateRepo.query(
                    paginatedQuery,
                    [sbu_id, limit, offset]
                );

                const totalQuery = `
                SELECT COUNT(*) AS total 
                FROM master_room_rates 
                WHERE sbu_id = ?
            `;
                const totalResult = await this.roomRateRepo.query(totalQuery, [
                    sbu_id,
                ]);
                const total = totalResult[0].total;

                return paginationResponse({
                    data: roomRateList,
                    total,
                    page: page_number,
                    limit,
                });
            }
        } catch (error) {
            console.error("error in find-all-roomRate: ", error);
            handleError(error, "while getting all roomRate");
        }
    }

    async findRoomRateById(room_rate_id: number) {
        try {
            const roomRate = await this.roomRateRepo.findOne({
                where: { id: room_rate_id },
            });
            if (!roomRate) {
                throw new NotFoundException("roomRate was not found");
            }

            return roomRate;
        } catch (error) {
            console.error("error in find-one-roomRate: ", error);
            handleError(error, "while getting roomRate");
        }
    }

    async updateRoomRate(room_rate_id: number, dto: UpdateMasterRoomRateDto) {
        const transaction = await this.queryService.createTransaction();
        try {
            await transaction.startTransaction();

            // Perform the update directly without fetching the entity first
            const updatedRoomRate = await transaction.update(
                MasterRoomRate,
                { id: room_rate_id },
                {
                    ...dto,
                    updated_by: Number(getCurrentUser("user_id")),
                }
            );

            await transaction.commitTransaction();
            return updatedRoomRate;
        } catch (error) {
            console.error("error in update-roomRate: ", error);
            await transaction.rollbackTransaction();
            handleError(error, "while updating roomRate");
        } finally {
            await transaction.release();
        }
    }

    async removeroomRate(room_rate_id: number) {
        const transaction = await this.queryService.createTransaction();
        try {
            await transaction.startTransaction();

            await transaction.softDelete(
                MasterRoomRate,
                { id: room_rate_id },
                { deleted_by: Number(getCurrentUser("user_id")) }
            );

            await transaction.commitTransaction();
            return `roomRate was deleted successfully`;
        } catch (error) {
            console.error("error in remove-roomRate: ", error);
            await transaction.rollbackTransaction();
            handleError(error, "while deleting roomRate");
        } finally {
            await transaction.release();
        }
    }
}
