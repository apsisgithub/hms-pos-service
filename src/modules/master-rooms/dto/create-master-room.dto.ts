import { ApiProperty, PartialType } from "@nestjs/swagger";
import {
    IsString,
    Length,
    IsNotEmpty,
    IsInt,
    IsOptional,
    IsEnum,
    IsNumber,
} from "class-validator";
import { Type } from "class-transformer";
import {
    RoomGeneralStatus,
    RoomOccupancyStatus,
} from "src/modules/master-rooms/entities/master_room.entity";
// Adjust path

export class CreateMasterRoomDto {
    @ApiProperty({ description: "ID of the SBU this room belongs to" })
    @IsInt()
    @IsNotEmpty()
    sbu_id: number;

    @ApiProperty({ description: "Unique room number", maxLength: 50 })
    @IsString()
    @IsNotEmpty()
    @Length(1, 50)
    room_number: string;

    @ApiProperty({
        description: "Optional code for the room",
        required: false,
        maxLength: 50,
    })
    @IsOptional()
    @IsString()
    @Length(1, 50)
    room_code?: string;

    @ApiProperty({
        description: "ID of the room type (e.g., Standard, Deluxe)",
        required: false,
    })
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    room_type_id?: number;

    @ApiProperty({
        description: "ID of the floor this room is on",
        required: false,
    })
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    floor_id?: number;

    @ApiProperty({
        description: "ID of the building this room is in",
        required: false,
    })
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    building_id?: number;

    @ApiProperty({ description: "Description of the room", required: false })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({
        description: "Current occupancy status of the room",
        enum: RoomOccupancyStatus,
        default: RoomOccupancyStatus.Available,
    })
    @IsEnum(RoomOccupancyStatus)
    @IsOptional() // Mark as optional if backend defaults are applied or status changes frequently
    status?: RoomOccupancyStatus = RoomOccupancyStatus.Available;

    @ApiProperty({
        description: "Rate of the room",
        required: false,
        type: "number",
        format: "float",
    })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    room_rate?: number;
}
