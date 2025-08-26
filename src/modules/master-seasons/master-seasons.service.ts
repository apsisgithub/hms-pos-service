import {
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    Inject,
    BadRequestException,
} from "@nestjs/common";
import { CreateSeasonDto } from "./dto/create-master-season.dto";
import { UpdateMasterSeasonDto } from "./dto/update-master-season.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { MasterSeason } from "./entities/master_seasons.entity";
import { In, Repository } from "typeorm";
import { handleError } from "src/utils/handle-error.util";
import { QueryManagerService } from "src/common/query-manager/query.service";
import { GetSeasonsDto } from "./dto/get-seasons.dto"; // Added for pagination
import { paginationResponse } from "src/utils/pagination-response.util"; // Ensure this import path is correct
import { getCurrentUser } from "src/common/utils/user.util"; // Ensure this import path is correct
import { MasterRoomType } from "../master-room-types/entities/master_room_types.entity";
import { SeasonRoomTypeMapping } from "./entities/master_season_room_type_mapping.entity";
import { flattenSeasonsData } from "src/utils/response-flatten/get-season-list.response";

@Injectable()
export class MasterSeasonsService {
    constructor(
        @Inject() private readonly queryService: QueryManagerService,

        @InjectRepository(MasterSeason)
        private readonly seasonRepo: Repository<MasterSeason>,

        @InjectRepository(MasterRoomType)
        private readonly roomTypeRepo: Repository<MasterRoomType>,

        @InjectRepository(SeasonRoomTypeMapping)
        private readonly seasonRoomTypeMappingRepo: Repository<SeasonRoomTypeMapping>
    ) {}

    async createSeason(dto: CreateSeasonDto) {
        const transaction = await this.queryService.createTransaction();
        try {
            await transaction.startTransaction();

            const newSeason = new MasterSeason();
            Object.assign(newSeason, dto);
            newSeason.created_by = Number(getCurrentUser("user_id"));

            const res = (await transaction.save(
                MasterSeason,
                newSeason
            )) as MasterSeason;

            const existingRoomsTypes = await this.roomTypeRepo.findBy({
                id: In(dto.room_type_ids),
            });

            if (existingRoomsTypes.length != dto.room_type_ids.length) {
                const foundIds = new Set(
                    existingRoomsTypes.map((room) => room.id)
                );
                const missingIds = dto.room_type_ids.filter(
                    (id) => !foundIds.has(id)
                );
                throw new BadRequestException(
                    `One or More room type IDs are invalid: ${missingIds.join(", ")}`
                );
            }

            const newSeasonRoomTypeMappings = dto.room_type_ids.map(
                (room_type_id) => ({
                    season_id: res.id,
                    room_type_id,
                    created_by: Number(getCurrentUser("user_id")),
                })
            );

            await transaction.save(
                SeasonRoomTypeMapping,
                newSeasonRoomTypeMappings
            );

            await transaction.commitTransaction();
            return res;
        } catch (error) {
            console.error("error in create-season: ", error);
            await transaction.rollbackTransaction();
            handleError(error, "while creating season");
        } finally {
            await transaction.release();
        }
    }

    async findAllSeasons(dto: GetSeasonsDto) {
        try {
            const { page_number = 1, limit, sbu_id } = dto;

            // If no limit is provided, return all seasons without pagination
            if (limit === undefined || limit === null) {
                const baseQuery = `
                SELECT
                    s.id AS season_id,
                    s.season_name AS season_name,
                    s.short_code AS short_code,
                    s.expiration_date,
                    s.from_day,
                    s.to_day,
                    s.from_month,
                    s.to_month,
                    r.id AS room_type_id,
                    r.name AS room_type_name,
                    r.short_name AS room_type_short_name
                FROM
                    master_seasons AS s
                JOIN
                    master_season_room_type_mapping AS m ON s.id = m.season_id
                JOIN
                    master_room_types AS r ON m.room_type_id = r.id
                WHERE
                    s.sbu_id = ?
                AND s.deleted_at IS NULL
                ORDER BY s.id
            `;

                const seasonList = await this.seasonRepo.query(baseQuery, [
                    sbu_id,
                ]);
                return flattenSeasonsData(seasonList);
            }

            // Paginated approach - First get the total count of seasons
            const countQuery = `
            SELECT COUNT(DISTINCT s.id) as total 
            FROM master_seasons AS s
            JOIN master_season_room_type_mapping AS m ON s.id = m.season_id
            WHERE s.sbu_id = ? AND s.deleted_at IS NULL
        `;

            const totalResult = await this.seasonRepo.query(countQuery, [
                sbu_id,
            ]);
            const totalSeasons = totalResult[0].total;

            // If no seasons found, return empty result
            if (totalSeasons === 0) {
                return paginationResponse({
                    data: [],
                    total: 0,
                    page: page_number,
                    limit,
                });
            }

            // Step 1: Get the paginated season IDs only
            const paginatedSeasonQuery = `
            SELECT DISTINCT s.id
            FROM master_seasons AS s
            JOIN master_season_room_type_mapping AS m ON s.id = m.season_id
            WHERE s.sbu_id = ? AND s.deleted_at IS NULL
            ORDER BY s.id
            LIMIT ? OFFSET ?
        `;

            const offset = (page_number - 1) * limit;
            const paginatedSeasons = await this.seasonRepo.query(
                paginatedSeasonQuery,
                [sbu_id, limit, offset]
            );

            // If no seasons found for this page, return empty result
            if (paginatedSeasons.length === 0) {
                return paginationResponse({
                    data: [],
                    total: totalSeasons,
                    page: page_number,
                    limit,
                });
            }

            // Step 2: Get all season IDs from the paginated result
            const seasonIds = paginatedSeasons.map((season) => season.id);

            // Step 3: Get complete data for these specific seasons with all their room types
            const placeholders = seasonIds.map(() => "?").join(",");
            const fullDataQuery = `
            SELECT
                s.id AS season_id,
                s.season_name AS season_name,
                s.short_code AS short_code,
                s.expiration_date,
                s.from_day,
                s.to_day,
                s.from_month,
                s.to_month,
                r.id AS room_type_id,
                r.name AS room_type_name,
                r.short_name AS room_type_short_name
            FROM
                master_seasons AS s
            JOIN
                master_season_room_type_mapping AS m ON s.id = m.season_id
            JOIN
                master_room_types AS r ON m.room_type_id = r.id
            WHERE
                s.id IN (${placeholders})
            AND s.deleted_at IS NULL
            ORDER BY s.id, r.id
        `;

            const seasonList = await this.seasonRepo.query(
                fullDataQuery,
                seasonIds
            );

            return paginationResponse({
                data: flattenSeasonsData(seasonList),
                total: totalSeasons,
                page: page_number,
                limit,
            });
        } catch (error) {
            console.error("error in find-all-season: ", error);
            handleError(error, "while getting all seasons");
        }
    }

    async findSeasonById(season_id: number) {
        try {
            const season = await this.seasonRepo.findOne({
                where: { id: season_id },
            });
            if (!season) {
                throw new NotFoundException("season was not found");
            }

            return season;
        } catch (error) {
            console.error("error in find-one-season: ", error);
            handleError(error, "while getting season");
        }
    }

    // Alternative approach: Update differences only
    async updateSeason(season_id: number, dto: UpdateMasterSeasonDto) {
        const transaction = await this.queryService.createTransaction();
        try {
            await transaction.startTransaction();

            const { room_type_ids, ...seasonData } = dto;

            // Update main season table
            await transaction.update(
                MasterSeason,
                { id: season_id },
                {
                    ...seasonData,
                    updated_by: Number(getCurrentUser("user_id")),
                }
            );

            // Handle room type mappings
            if (room_type_ids && room_type_ids?.length > 0) {
                // Validate room type IDs
                const existingRoomTypes = await this.roomTypeRepo.findBy({
                    id: In(room_type_ids),
                });

                if (existingRoomTypes.length !== room_type_ids.length) {
                    const foundIds = new Set(
                        existingRoomTypes.map((room) => room.id)
                    );
                    const missingIds = room_type_ids.filter(
                        (id) => !foundIds.has(id)
                    );
                    throw new BadRequestException(
                        `Invalid room type IDs: ${missingIds.join(", ")}`
                    );
                }

                await transaction.query(
                    `
                UPDATE master_season_room_type_mapping
                SET deleted_at = NOW() 
                WHERE season_id = ?
            `,
                    [season_id]
                );

                // Prepare new mappings
                const newMappings = room_type_ids.map((room_type_id) => ({
                    season_id,
                    room_type_id,
                    created_by: Number(getCurrentUser("user_id")),
                }));

                // Save new mappings
                await transaction.save(SeasonRoomTypeMapping, newMappings);
            }

            await transaction.commitTransaction();
            return { message: "Season updated successfully" };
        } catch (error) {
            console.error("Error in update-season: ", error);
            await transaction.rollbackTransaction();
            handleError(error, "while updating season");
        } finally {
            await transaction.release();
        }
    }

    async removeSeason(season_id: number) {
        const transaction = await this.queryService.createTransaction();
        try {
            await transaction.startTransaction();

            // Directly soft-delete the season without fetching it first
            await transaction.softDelete(
                MasterSeason,
                { id: season_id },
                { deleted_by: Number(getCurrentUser("user_id")) }
            );

            await transaction.commitTransaction();
            return `season was deleted successfully`;
        } catch (error) {
            console.error("error in remove-season: ", error);
            await transaction.rollbackTransaction();
            handleError(error, "while deleting season");
        } finally {
            await transaction.release();
        }
    }
}
