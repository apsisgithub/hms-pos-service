import {
    Inject,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from "@nestjs/common";
import { CreateMasterRoomTypeDto } from "./dto/create-master-room-type.dto";
import { UpdateMasterRoomTypeDto } from "./dto/update-master-room-type.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { MasterRoomType } from "./entities/master_room_types.entity";
import { Repository } from "typeorm";
import { handleError } from "src/utils/handle-error.util";
import { QueryManagerService } from "src/common/query-manager/query.service";
import { GetRoomTypesDto } from "./dto/get-room-types.dto"; // Added for pagination
import { paginationResponse } from "src/utils/pagination-response.util"; // Ensure this import path is correct
import { getCurrentUser } from "src/common/utils/user.util"; // Ensure this import path is correct

@Injectable()
export class MasterRoomTypesService {
    constructor(
        @Inject() private readonly queryService: QueryManagerService,
        @InjectRepository(MasterRoomType)
        private readonly roomTypeRepo: Repository<MasterRoomType>
    ) {}

    async createRoomType(dto: CreateMasterRoomTypeDto) {
        const transaction = await this.queryService.createTransaction();
        try {
            await transaction.startTransaction();

            const newRoomType = new MasterRoomType();
            Object.assign(newRoomType, dto);
            newRoomType.created_by = Number(getCurrentUser("user_id"));

            const res = await transaction.save(MasterRoomType, newRoomType);

            await transaction.commitTransaction();
            return res;
        } catch (error) {
            console.error("error in create-roomType: ", error);
            await transaction.rollbackTransaction();
            handleError(error, "while creating roomType");
        } finally {
            await transaction.release();
        }
    }

    async findAllRoomTypes(dto: GetRoomTypesDto) {
        // Added DTO parameter
        try {
            const { page_number = 1, limit, sbu_id } = dto; // Removed default limit to allow fetching all

            if (limit === undefined || limit === null) {
                const roomTypeList = await this.roomTypeRepo.find({
                    order: {
                        id: "ASC",
                    },
                    where: { sbu_id },
                });

                return roomTypeList; // Return all room types without pagination
            } else {
                const [roomTypeList, total] =
                    await this.roomTypeRepo.findAndCount({
                        skip: (page_number - 1) * limit,
                        take: limit,
                        order: {
                            id: "ASC",
                        },
                        where: { sbu_id },
                    });

                return paginationResponse({
                    data: roomTypeList,
                    total,
                    page: page_number,
                    limit,
                });
            }
        } catch (error) {
            console.error("error in find-all-roomType: ", error);
            handleError(error, "while getting all roomType");
        }
    }

    async findRoomTypeById(room_type_id: number) {
        try {
            const roomType = await this.roomTypeRepo.findOne({
                where: { id: room_type_id },
            });
            if (!roomType) {
                throw new NotFoundException("roomType was not found");
            }

            return roomType;
        } catch (error) {
            console.error("error in find-one-roomType: ", error);
            handleError(error, "while getting roomType");
        }
    }

    async updateRoomType(room_type_id: number, dto: UpdateMasterRoomTypeDto) {
        const transaction = await this.queryService.createTransaction();
        try {
            await transaction.startTransaction();

            // Directly update the room type without fetching it first
            const updatedRoomType = await transaction.update(
                MasterRoomType,
                { id: room_type_id },
                {
                    ...dto,
                    updated_by: Number(getCurrentUser("user_id")),
                }
            );

            await transaction.commitTransaction();
            return updatedRoomType;
        } catch (error) {
            console.error("error in update-roomType: ", error);
            await transaction.rollbackTransaction();
            handleError(error, "while updating roomType");
        } finally {
            await transaction.release();
        }
    }

    async removeRoomType(room_type_id: number) {
        const transaction = await this.queryService.createTransaction();
        try {
            await transaction.startTransaction();

            // Directly soft-delete the room type without fetching it first
            await transaction.softDelete(
                MasterRoomType,
                { id: room_type_id },
                { deleted_by: Number(getCurrentUser("user_id")) }
            );

            await transaction.commitTransaction();
            return `roomType was deleted successfully`;
        } catch (error) {
            console.error("error in remove-roomType: ", error);
            await transaction.rollbackTransaction();
            handleError(error, "while deleting roomType");
        } finally {
            await transaction.release();
        }
    }
}
