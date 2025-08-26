import {
    BadRequestException,
    Inject,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from "@nestjs/common";
import { CreateMasterRoomDto } from "./dto/create-master-room.dto";
import { UpdateMasterRoomDto } from "./dto/update-master-room.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { MasterRoom, RoomOccupancyStatus } from "./entities/master_room.entity";
import { DataSource, In, Repository } from "typeorm";
import { handleError } from "src/utils/handle-error.util";
import { QueryManagerService } from "src/common/query-manager/query.service";
import { GetRoomsDto } from "./dto/get-rooms.dto"; // Added for pagination
import { paginationResponse } from "src/utils/pagination-response.util"; // Ensure this import path is correct
import { getCurrentUser } from "src/common/utils/user.util"; // Ensure this import path is correct
import { CreateJointRoomDto } from "./dto/create-joint-room.dto";
import { JointRoom } from "./entities/master_joint_room.entity";
import { JointRoomMappingRoom } from "./entities/master_joint_room_mapping_room.entity";
import { GetJointRoomsDto } from "./dto/get-joint-rooms.dto";
import { GetRoomDetailsTreeDto } from "./dto/get-room-details-tree.dto";
import { RoomTypeStatus } from "../master-room-types/entities/master_room_types.entity";
import { RateTypeStatus } from "../master-rate-types/entities/master_rate_type.entity";
import { UpdateJointRoomDto } from "./dto/update-joint-room.dto";

@Injectable()
export class MasterRoomsService {
    constructor(
        @Inject() private readonly queryService: QueryManagerService,
        @InjectRepository(MasterRoom)
        private readonly roomRepo: Repository<MasterRoom>,
        @InjectRepository(JointRoom)
        private readonly jointRoomRepo: Repository<JointRoom>,
        @InjectRepository(JointRoomMappingRoom)
        private readonly jointRoomMappingRepo: Repository<JointRoomMappingRoom>,
        private readonly dataSource: DataSource
    ) {}

    async createRoom(dto: CreateMasterRoomDto) {
        const transaction = await this.queryService.createTransaction();
        try {
            await transaction.startTransaction();

            const newRoom = new MasterRoom();
            Object.assign(newRoom, dto);
            newRoom.created_by = Number(getCurrentUser("user_id"));

            const res = await transaction.save(MasterRoom, newRoom);

            await transaction.commitTransaction();
            return res;
        } catch (error) {
            console.error("error in create-room: ", error);
            await transaction.rollbackTransaction();
            handleError(error, "while creating room");
        } finally {
            await transaction.release();
        }
    }

    async findAllRooms(dto: GetRoomsDto) {
        try {
            const { page_number = 1, limit, sbu_id, rate_type_id } = dto;

            const queryBuilder = this.roomRepo
                .createQueryBuilder("room")
                .leftJoin("room.roomType", "roomType")
                .leftJoin("roomType.roomTypeRates", "rateType")
                .leftJoin("room.floor", "floor")
                .leftJoin("room.building", "building")
                .leftJoin("room.sbu", "sbu")
                .select([
                    "room.id",
                    "room.sbu_id",
                    "room.room_number",
                    "room.room_code",
                    "room.room_type_id",
                    "room.floor_id",
                    "room.building_id",
                    "room.description",
                    "room.status",
                    "room.generalStatus",
                    "room.room_rate",
                    "room.created_at",
                    "room.created_by",
                    "room.updated_at",
                    "room.updated_by",
                    "room.deleted_at",
                    "room.deleted_by",
                ])
                .addSelect("roomType.name", "room_type")
                .addSelect("floor.name", "floor_name")
                .addSelect("building.name", "building_name")
                .addSelect("sbu.name", "sbu_name")
                .addSelect("rateType.id", "rate_type_id")
                .groupBy("room.id");

            // Filter by sbu_id if provided
            if (sbu_id) {
                queryBuilder.where("room.sbu_id = :sbu_id", { sbu_id });
            }

            // Filter by rate_type_id if provided
            if (rate_type_id !== undefined) {
                if (sbu_id) {
                    queryBuilder.andWhere("rateType.id = :rate_type_id", {
                        rate_type_id,
                    });
                } else {
                    queryBuilder.where("rateType.id = :rate_type_id", {
                        rate_type_id,
                    });
                }
            }

            queryBuilder.orderBy("room.id", "ASC");

            if (limit === undefined || limit === null) {
                const rawRooms = await queryBuilder.getRawMany();
                return rawRooms;
            } else {
                const [rooms, total] = await queryBuilder
                    .skip((page_number - 1) * limit)
                    .take(limit)
                    .getManyAndCount();

                const rawRooms = await queryBuilder
                    .skip((page_number - 1) * limit)
                    .take(limit)
                    .getRawMany();

                return paginationResponse({
                    data: rawRooms,
                    total,
                    page: page_number,
                    limit,
                });
            }
        } catch (error) {
            console.error("error in find-all-room: ", error);
            handleError(error, "while getting all room");
        }
    }

    async findRoomById(room_id: number) {
        try {
            const room = await this.roomRepo.findOne({
                where: { id: room_id },
            });
            if (!room) {
                throw new NotFoundException("room was not found");
            }

            return room;
        } catch (error) {
            console.error("error in find-one-room: ", error);
            handleError(error, "while getting room");
        }
    }

    async updateRoom(room_id: number, dto: UpdateMasterRoomDto) {
        const transaction = await this.queryService.createTransaction();
        try {
            await transaction.startTransaction();

            // Directly update the room without fetching it first
            const updatedRoom = await transaction.update(
                MasterRoom,
                { id: room_id },
                {
                    ...dto,
                    updated_by: Number(getCurrentUser("user_id")),
                }
            );

            await transaction.commitTransaction();
            return updatedRoom;
        } catch (error) {
            console.error("error in update-room: ", error);
            await transaction.rollbackTransaction();
            handleError(error, "while updating room");
        } finally {
            await transaction.release();
        }
    }

    async updateRoomWithTransaction(
        room_id: number,
        dto: UpdateMasterRoomDto,
        transaction: any
    ) {
        try {
            // Directly update the room without fetching it first
            const updatedRoom = await transaction.update(
                MasterRoom,
                { id: room_id },
                {
                    ...dto,
                    updated_by: Number(getCurrentUser("user_id")),
                }
            );

            return updatedRoom;
        } catch (error) {
            console.error("error in update-room-with-transaction: ", error);
            throw error; // Re-throw to let parent transaction handle rollback
        }
    }

    async removeRoom(room_id: number) {
        const transaction = await this.queryService.createTransaction();
        try {
            await transaction.startTransaction();

            // Directly soft-delete the room without fetching it first
            await transaction.softDelete(
                MasterRoom,
                { id: room_id },
                { deleted_by: Number(getCurrentUser("user_id")) }
            );

            await transaction.commitTransaction();
            return `room was deleted successfully`;
        } catch (error) {
            console.error("error in remove-room: ", error);
            await transaction.rollbackTransaction();
            handleError(error, "while deleting room");
        } finally {
            await transaction.release();
        }
    }

    async createJointRoom(dto: CreateJointRoomDto) {
        const transaction = await this.queryService.createTransaction();
        try {
            await transaction.startTransaction();

            const existingRooms = await this.roomRepo.findBy({
                id: In(dto.room_ids),
            });

            if (existingRooms.length != dto.room_ids.length) {
                const foundIds = new Set(existingRooms.map((room) => room.id));
                const missingIds = dto.room_ids.filter(
                    (id) => !foundIds.has(id)
                );
                throw new BadRequestException(
                    `One or More room IDs are invalid: ${missingIds.join(", ")}`
                );
            }

            const newJointRoom = new JointRoom();
            Object.assign(newJointRoom, dto);
            newJointRoom.created_by = Number(getCurrentUser("user_id"));

            const jointRoom = (await transaction.save(
                JointRoom,
                newJointRoom
            )) as JointRoom;

            const roomMappings = dto.room_ids.map((room_id) => ({
                joint_room_id: jointRoom.id,
                room_id,
                created_by: Number(getCurrentUser("user_id")),
            }));

            await transaction.save(JointRoomMappingRoom, roomMappings);

            await transaction.commitTransaction();

            return `joint-room created successfully`;
        } catch (error) {
            console.error("error in create-joint-room: ", error);
            await transaction.rollbackTransaction();
            handleError(error);
        } finally {
            await transaction.release();
        }
    }

    async findAllJointRooms(dto: GetJointRoomsDto) {
        try {
            const { page_number = 1, sbu_id, limit } = dto;

            const dataQueryBuilder = this.jointRoomRepo
                .createQueryBuilder("jr")
                .leftJoin(
                    "master_joint_room_mapping_rooms",
                    "jrm",
                    "jr.id = jrm.joint_room_id"
                )
                .leftJoin("master_rooms", "room", "jrm.room_id = room.id")
                .select(["jr.id", "jr.joint_room_name"])
                .addSelect(
                    "GROUP_CONCAT(room.room_number)",
                    "room_numbers_string"
                )
                .addSelect("GROUP_CONCAT(room.room_code)", "room_codes_string")
                .addSelect("GROUP_CONCAT(room.id)", "room_ids_string")
                .addSelect("COUNT(room.id)", "total_rooms_count")
                .where("jr.deleted_at IS NULL")
                .groupBy("jr.id")
                .orderBy("jr.id", "ASC");

            if (sbu_id) {
                dataQueryBuilder.andWhere("room.sbu_id = :sbuId", {
                    sbuId: sbu_id,
                });
            }

            // Get all matching records
            const allJointRooms = await dataQueryBuilder.getRawMany();
            const total = allJointRooms.length;

            // Apply pagination in memory
            let paginatedRooms = allJointRooms;
            if (limit !== undefined) {
                const startIndex = (page_number - 1) * limit;
                paginatedRooms = allJointRooms.slice(
                    startIndex,
                    startIndex + limit
                );
            }

            const formattedJointRooms = paginatedRooms.map((room) => ({
                id: room.jr_id,
                joint_room_name: room.jr_joint_room_name,
                room_numbers: room.room_numbers_string
                    ? room.room_numbers_string.split(",")
                    : [],
                room_codes: room.room_codes_string
                    ? room.room_codes_string.split(",")
                    : [],
                room_ids: room.room_ids_string
                    ? room.room_ids_string
                          .split(",")
                          .map((id) => parseInt(id, 10))
                    : [],
                total_rooms: parseInt(room.total_rooms_count, 10),
            }));

            return paginationResponse({
                data: formattedJointRooms,
                total,
                page: page_number,
                limit,
            });
        } catch (error) {
            console.error("error in find-all-joint-rooms: ", error);
            handleError(error, "while getting all joint rooms");
        }
    }

    async updateJointRoom(id: number, dto: UpdateJointRoomDto) {
        const transaction = await this.queryService.createTransaction();
        try {
            await transaction.startTransaction();

            await transaction.update(
                JointRoom,
                { id },
                {
                    joint_room_name: dto.joint_room_name,
                    number_of_rooms: dto.number_of_rooms,
                }
            );

            const newMappings =
                dto.room_ids?.map((room_id) => ({
                    joint_room_id: id,
                    room_id,
                })) || [];

            await transaction.bulkDeleteAndCreate(
                JointRoomMappingRoom,
                { joint_room_id: id },
                newMappings
            );

            await transaction.commitTransaction();
            return "Joint room updated successfully";
        } catch (error) {
            console.error("error is update joint-room: ", error);
            await transaction.rollbackTransaction();
            handleError(error);
        } finally {
            await transaction.release();
        }
    }

    async fetchRoomReservationDetailsTree(sbu_id: number) {
        try {
            const result = await this.dataSource.query(
                `SELECT
                    master_room_types.id AS room_type_id,
                    master_room_types.name AS room_type,
                    master_room_types.base_price AS room_type_rate,
                    master_room_types.extra_bed_price AS room_type_extra_bed_price,
                    master_room_types.base_occupancy_adult AS room_type_base_occupancy_adult_number,
                    master_room_types.base_occupancy_child AS room_type_base_occupancy_child_number,
                    master_room_types.max_occupancy_adult AS room_type_max_occupancy_adult_number,
                    master_room_types.max_occupancy_child AS room_type_max_occupancy_child_number,
                    master_rate_types.id AS rate_type_id,
                    master_rate_types.name AS rate_type,
                    master_rooms.id AS room_id,
                    master_rooms.room_number,
                    master_rooms.room_code,
                    master_rooms.room_rate
                FROM
                    master_rooms
                LEFT JOIN
                    master_room_types ON master_room_types.id = master_rooms.room_type_id
                LEFT JOIN
                    master_room_type_rates ON master_room_type_rates.room_type_id = master_room_types.id
                LEFT JOIN
                    master_rate_types ON master_rate_types.id = master_room_type_rates.rate_type_id
                WHERE
                    master_rooms.sbu_id = ?
                    AND master_rooms.status = 'Available'
                    AND master_room_types.status = 'Active'
                    AND master_rate_types.status = 'Active'
                    AND master_rate_types.deleted_at IS NULL
                    AND master_room_types.deleted_at IS NULL
                    AND master_rooms.deleted_at IS NULL
                ORDER BY
                    master_room_types.name,
                    master_rate_types.name,
                    master_rooms.room_number;`,
                [sbu_id]
            );

            // Transform flat data into cascading structure
            const roomTypeMap = new Map();

            result.forEach((row: any) => {
                const {
                    room_type_id,
                    room_type,
                    room_type_rate,
                    room_type_extra_bed_price,
                    room_type_base_occupancy_adult_number,
                    room_type_base_occupancy_child_number,
                    room_type_max_occupancy_adult_number,
                    room_type_max_occupancy_child_number,
                    rate_type_id,
                    rate_type,
                    room_id,
                    room_number,
                    room_code,
                    room_rate,
                } = row;

                // Initialize room type if not exists
                if (!roomTypeMap.has(room_type_id)) {
                    roomTypeMap.set(room_type_id, {
                        room_type_id,
                        room_type,
                        room_type_rate,
                        room_type_extra_bed_price,
                        room_type_base_occupancy_adult_number,
                        room_type_base_occupancy_child_number,
                        room_type_max_occupancy_adult_number,
                        room_type_max_occupancy_child_number,
                        rate_types: new Map(),
                    });
                }

                const roomTypeData = roomTypeMap.get(room_type_id);

                // Initialize rate type if not exists
                if (!roomTypeData.rate_types.has(rate_type_id)) {
                    roomTypeData.rate_types.set(rate_type_id, {
                        rate_type_id,
                        rate_type,
                        rooms: [],
                    });
                }

                const rateTypeData = roomTypeData.rate_types.get(rate_type_id);

                // Add room to rate type
                rateTypeData.rooms.push({
                    room_id,
                    room_number,
                    room_code,
                    room_rate,
                });
            });

            // Convert Maps to Arrays for JSON response
            const cascadingData = Array.from(roomTypeMap.values()).map(
                (roomType) => ({
                    room_type_id: roomType.room_type_id,
                    room_type: roomType.room_type,
                    room_type_rate: roomType.room_type_rate,
                    room_type_extra_bed_price:
                        roomType.room_type_extra_bed_price,
                    room_type_base_occupancy_adult_number:
                        roomType.room_type_base_occupancy_adult_number,
                    room_type_base_occupancy_child_number:
                        roomType.room_type_base_occupancy_child_number,
                    room_type_max_occupancy_adult_number:
                        roomType.room_type_max_occupancy_adult_number,
                    room_type_max_occupancy_child_number:
                        roomType.room_type_max_occupancy_child_number,
                    rate_types: Array.from(roomType.rate_types.values()),
                })
            );

            return cascadingData;
        } catch (error) {
            console.error("error in fetch-room-details: ", error);
            handleError(error, "while getting fetch room details");
        }
    }

    async deleteJointRoom(id: number) {
        const transaction = await this.queryService.createTransaction();
        try {
            await transaction.startTransaction();

            await transaction.softDelete(
                JointRoom,
                { id },
                { deleted_by: Number(getCurrentUser("user_id")) }
            );

            await transaction.commitTransaction();

            return `joint-room was deleted`;
        } catch (error) {
            console.error("error in delete joint-room: ", error);
            await transaction.rollbackTransaction();
            handleError(error);
        } finally {
            await transaction.release();
        }
    }
}
