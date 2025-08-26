import {
    BadRequestException,
    Inject,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { CreateMasterGuestDto } from "./dto/create-master-guest.dto";
import { UpdateMasterGuestDto } from "./dto/update-master-guest.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { MasterGuest } from "./entities/master-guest.entity";
import { QueryManagerService } from "src/common/query-manager/query.service";
import { handleError } from "src/utils/handle-error.util";
import { getCurrentUser } from "src/common/utils/user.util";
import { GetGuestsDto } from "./dto/get-guests.dto";
import { paginationResponse } from "src/utils/pagination-response.util";
import { SearchGuestDto, SearchField } from "./dto/search-guest.dto";
import {
    CreateMultipleSharerGuestsDto,
    CreateSharerGuestDto,
} from "./dto/create-sharer.dto";
import { MasterReservationGuests } from "../master-reservation/entities/master_reservation_guests.entity";
import { ReservationRoom } from "../master-reservation/entities/master_reservation_room.entity";
import { UpdateReservedGuestDto } from "./dto/update-reserved-guest.dto";

@Injectable()
export class MasterGuestsService {
    constructor(
        @Inject() private readonly queryService: QueryManagerService,
        @InjectRepository(MasterGuest)
        private readonly guestRepo: Repository<MasterGuest>,
        @InjectRepository(ReservationRoom)
        private readonly reservationRoomRepo: Repository<ReservationRoom>,
        private readonly dataSource: DataSource,
        @InjectRepository(MasterReservationGuests)
        private readonly reservationGuestRepo: Repository<MasterReservationGuests>
    ) {}
    async create(dto: CreateMasterGuestDto) {
        const transaction = await this.queryService.createTransaction();
        try {
            await transaction.startTransaction();

            const newGuest = new MasterGuest();
            Object.assign(newGuest, dto);
            newGuest.created_by = Number(getCurrentUser("user_id"));

            const res = await transaction.save(MasterGuest, newGuest);

            await transaction.commitTransaction();
            return res;
        } catch (error) {
            console.error("error in create-Guest: ", error);
            await transaction.rollbackTransaction();
            handleError(error, "while creating Guest");
        } finally {
            await transaction.release();
        }
    }

    async findAll(dto: GetGuestsDto) {
        try {
            const { page_number = 1, limit, sbu_id } = dto;

            if (limit === undefined || limit === null) {
                const GuestList = await this.guestRepo.find({
                    order: {
                        id: "ASC",
                    },
                    where: { sbu_id },
                });

                return GuestList;
            } else {
                const [GuestList, total] = await this.guestRepo.findAndCount({
                    skip: (page_number - 1) * limit,
                    take: limit,
                    order: {
                        id: "ASC",
                    },
                    where: { sbu_id },
                });

                return paginationResponse({
                    data: GuestList,
                    total,
                    page: page_number,
                    limit,
                });
            }
        } catch (error) {
            console.error("error in find-all-Guest: ", error);
            handleError(error, "while getting all Guest");
        }
    }

    async findOne(guest_id: number) {
        try {
            const Guest = await this.guestRepo.findOne({
                where: { id: guest_id },
            });
            if (!Guest) {
                throw new NotFoundException("Guest was not found");
            }

            return Guest;
        } catch (error) {
            console.error("error in find-one-Guest: ", error);
            handleError(error, "while getting Guest");
        }
    }

    async update(guest_id: number, dto: UpdateMasterGuestDto) {
        const transaction = await this.queryService.createTransaction();
        try {
            await transaction.startTransaction();

            const updatedGuest = await transaction.update(
                MasterGuest,
                { id: guest_id },
                {
                    ...dto,
                    updated_by: Number(getCurrentUser("user_id")),
                }
            );

            await transaction.commitTransaction();
            return updatedGuest;
        } catch (error) {
            console.error("error in update-Guest: ", error);
            await transaction.rollbackTransaction();
            handleError(error, "while updating Guest");
        } finally {
            await transaction.release();
        }
    }

    async remove(guest_id: number) {
        const transaction = await this.queryService.createTransaction();
        try {
            await transaction.startTransaction();

            await transaction.softDelete(
                MasterGuest,
                { id: guest_id },
                { deleted_by: Number(getCurrentUser("user_id")) }
            );

            await transaction.commitTransaction();
            return `Guest was deleted successfully`;
        } catch (error) {
            console.error("error in remove-Guest: ", error);
            await transaction.rollbackTransaction();
            handleError(error, "while deleting Guest");
        } finally {
            await transaction.release();
        }
    }

    async searchGuests(dto: SearchGuestDto) {
        try {
            const { search_term, field = SearchField.NAME } = dto;

            const queryBuilder = this.guestRepo
                .createQueryBuilder("guest")
                .select([
                    "guest.id",
                    "guest.name",
                    "guest.email",
                    "guest.contact_no",
                ]);

            // Build search condition based on the field using full-text search
            switch (field) {
                case SearchField.NAME:
                    queryBuilder.where(
                        "MATCH(guest.name) AGAINST(:searchTerm IN NATURAL LANGUAGE MODE)",
                        {
                            searchTerm: search_term,
                        }
                    );
                    break;
                case SearchField.EMAIL:
                    queryBuilder.where(
                        "MATCH(guest.email) AGAINST(:searchTerm IN NATURAL LANGUAGE MODE)",
                        {
                            searchTerm: search_term,
                        }
                    );
                    break;
                case SearchField.CONTACT_NO:
                    queryBuilder.where(
                        "MATCH(guest.contact_no) AGAINST(:searchTerm IN NATURAL LANGUAGE MODE)",
                        {
                            searchTerm: search_term,
                        }
                    );
                    break;
                default:
                    queryBuilder.where(
                        "MATCH(guest.name) AGAINST(:searchTerm IN NATURAL LANGUAGE MODE)",
                        {
                            searchTerm: search_term,
                        }
                    );
            }

            const guests = await queryBuilder
                .orderBy(`guest.${field}`, "ASC")
                .getMany();

            return guests;
        } catch (error) {
            console.error("error in search-guests: ", error);
            handleError(error, "while searching guests");
        }
    }

    async createSharerGuest(dto: CreateMultipleSharerGuestsDto) {
        const transaction = await this.queryService.createTransaction();
        try {
            await transaction.startTransaction();
            const roomId = dto.guests[0].room_id;
            const reservationId = dto.guests[0].reservation_id;

            // Check if room exists with any guest (using the common room_id)
            const existingRoomGuest = await this.reservationRoomRepo.findOne({
                where: { room_id: roomId },
            });

            if (!existingRoomGuest) {
                throw new BadRequestException(
                    "cannot add sharer...no guest was found for this room"
                );
            }

            const currentUserId = Number(getCurrentUser("user_id"));

            // Prepare array of MasterGuest entities
            const guestsToSave = dto.guests.map((guest) => {
                const newGuest = new MasterGuest();
                // Assign guest-specific properties (excluding reservation_id and room_id)
                Object.assign(newGuest, guest);
                newGuest.created_by = currentUserId;
                return newGuest;
            });

            const savedGuests = await transaction.bulkInsert(
                MasterGuest,
                guestsToSave
            );
            const guestIds = savedGuests.identifiers.map((idObj) => idObj.id);

            // Save all guests in bulk (assuming transaction.save supports array)
            // const savedGuests = await transaction.save(
            //     MasterGuest,
            //     guestsToSave
            // ) as MasterGuest;

            // Prepare reservation guests linking saved guests with common reservation_id and room_id
            const reservationGuests = guestIds.map((guestId) => {
                const reservationGuest = new MasterReservationGuests();
                reservationGuest.reservation_id = reservationId; // common for all
                reservationGuest.room_id = roomId; // common for all
                reservationGuest.guest_id = guestId;
                reservationGuest.is_master_guest = false;
                reservationGuest.created_by = currentUserId;
                return reservationGuest;
            });

            // Save all reservation guests in bulk
            await transaction.save(MasterReservationGuests, reservationGuests);

            await transaction.commitTransaction();
            return `successfully added sharer to the room`;
        } catch (error) {
            console.error("error in createSharerGuestsBulk: ", error);
            await transaction.rollbackTransaction();
            handleError(error, "while creating sharer guests");
        } finally {
            await transaction.release();
        }
    }

    async getGuestDetailsByReservationId(reservation_id: number) {
        try {
            const baseQuery = `
                SELECT guest.*
                FROM master_guests guest
                LEFT JOIN master_reservation_guests rg ON rg.guest_id = guest.id
                WHERE rg.reservation_id = ?
                AND rg.deleted_at IS NULL
            `;

            const result = await this.dataSource.query(baseQuery, [
                reservation_id,
            ]);

            if (!result) {
                throw new NotFoundException("guest info was not found");
            }

            return result[0];
        } catch (error) {
            console.error("error in guest-info-by-reservation: ", error);
            handleError(error);
        }
    }

    async getRoomWiseGuestsByReservation(reservation_id: number) {
        try {
            const baseQuery = `
      SELECT 
        mrt.id as room_type_id,
        mrt.name AS room_type_name,
        mrt.short_name AS room_type_short_name,
        mrt.description AS room_type_description,
        mrt.base_occupancy_adult,
        mrt.base_occupancy_child,
        mrt.max_occupancy_adult,
        mrt.max_occupancy_child,
        mrt.extra_bed_price,

        mr.id as room_id,
        mr.room_number,
        mr.room_rate,
        mr.description AS room_description,
        mr.room_code,

        mg.*  -- fetch all guest columns

      FROM master_reservation_guests mrg
      JOIN master_rooms mr ON mrg.room_id = mr.id
      JOIN master_room_types mrt ON mr.room_type_id = mrt.id
      JOIN master_guests mg ON mrg.guest_id = mg.id
      WHERE mrg.reservation_id = ?
      ORDER BY mrt.id, mr.id, mg.id
    `;

            const rows = await this.dataSource.query(baseQuery, [
                reservation_id,
            ]);

            const roomTypeMap: any = {};

            for (const row of rows) {
                const rtName = row.room_type_name;

                if (!roomTypeMap[rtName]) {
                    roomTypeMap[rtName] = {
                        id: row.room_type_id,
                        short_code: row.room_type_short_name,
                        description: row.room_type_description,
                        base_occupancy_adult: row.base_occupancy_adult,
                        base_occupancy_child: row.base_occupancy_child,
                        max_occupancy_adult: row.max_occupancy_adult,
                        max_occupancy_child: row.max_occupancy_child,
                        extra_bed_price: row.extra_bed_price,
                        rooms: [],
                    };
                }

                let room = roomTypeMap[rtName].rooms.find(
                    (r: any) => r.id === row.room_id
                );
                if (!room) {
                    room = {
                        id: row.room_id,
                        room_number: row.room_number,
                        room_rate: row.room_rate,
                        description: row.room_description,
                        room_code: row.room_code,
                        guests: [],
                    };
                    roomTypeMap[rtName].rooms.push(room);
                }

                if (!room.guests.find((g: any) => g.id === row.id)) {
                    // Extract guest fields from row
                    // Assuming guest fields are all prefixed uniquely or no conflicts
                    const { id, name, salutation, ...otherGuestFields } = row;
                    room.guests.push({
                        id: row.id,
                        name: row.name,
                        salutation: row.salutation,
                        ...otherGuestFields,
                    });
                }
            }

            // Convert map to array with key room_types
            const data = {
                room_types: Object.keys(roomTypeMap).map(
                    (rtName) => roomTypeMap[rtName]
                ),
            };

            return { data };
        } catch (error) {
            console.error("Error fetching room wise guests:", error);
            throw error;
        }
    }

    async updatedReservedGuest(
        reservation_id: number,
        dto: UpdateReservedGuestDto
    ) {
        const transaction = await this.queryService.createTransaction();
        try {
            const { room_id } = dto;
            await transaction.startTransaction();

            const newGuest = new MasterGuest();
            Object.assign(newGuest, dto);
            const savedGuest = (await transaction.save(
                MasterGuest,
                newGuest
            )) as MasterGuest;

            const reservationGuest = await this.reservationGuestRepo.findOne({
                where: { reservation_id, room_id },
            });

            console.log("previous_data: ", reservationGuest);

            if (!reservationGuest) {
                throw new BadRequestException(
                    "reservation or room is mismatched"
                );
            }

            reservationGuest.guest_id = savedGuest.id;
            console.log("updatedData: ", reservationGuest);
            await transaction.save(MasterReservationGuests, reservationGuest);

            await transaction.commitTransaction();

            return `successfully added new guest to the room`;
        } catch (error) {
            console.error("Error in update-room-guest:", error);
            await transaction.rollbackTransaction();
            handleError(error);
        } finally {
            await transaction.release();
        }
    }
}
