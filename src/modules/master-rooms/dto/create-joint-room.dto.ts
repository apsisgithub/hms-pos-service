// src/modules/joint-rooms/dto/create-joint-room.dto.ts

import {
    IsNotEmpty,
    IsString,
    IsNumber,
    IsArray,
    ArrayMinSize,
    IsEnum,
    IsOptional,
    Length,
    Min,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

import { JointRoomStatus } from "../entities/master_joint_room.entity";

export class CreateJointRoomDto {
    @ApiProperty({
        description: 'Name of the joint room (e.g., "Suite 201-202")',
        example: "Suite 201-202",
        maxLength: 255,
    })
    @IsNotEmpty({ message: "Joint Room Name cannot be empty." })
    @IsString({ message: "Joint Room Name must be a string." })
    @Length(1, 255, {
        message: "Joint Room Name must be between 1 and 255 characters.",
    })
    joint_room_name: string;

    @ApiProperty({
        description:
            "The number of individual rooms comprising this joint room.",
        example: 2,
        minimum: 2,
    })
    @IsNotEmpty({ message: "Number of Rooms cannot be empty." })
    @IsNumber({}, { message: "Number of Rooms must be a number." })
    @Min(2, { message: "A joint room must consist of at least 2 rooms." })
    number_of_rooms: number;

    @ApiProperty({
        description:
            "An array of IDs of the individual Master Rooms that belong to this joint room.",
        type: "array",
        items: {
            type: "number",
            format: "int32",
        },
        example: [201, 202], // Example room IDs
        minItems: 2, // A joint room needs at least 2 rooms
    })
    @IsNotEmpty({
        message: "At least two room IDs must be provided for a joint room.",
    })
    @IsArray({ message: "Room IDs must be provided as an array." })
    @ArrayMinSize(2, {
        message: "A joint room must include at least 2 individual room IDs.",
    })
    @IsNumber(
        {},
        { each: true, message: "Each room ID in the array must be a number." }
    )
    room_ids: number[]; // Array of MasterRoom IDs

    @ApiProperty({
        description: "Status of the joint room (Active or Inactive).",
        enum: JointRoomStatus,
        default: JointRoomStatus.Active,
        required: false,
    })
    @IsOptional()
    @IsEnum(JointRoomStatus, {
        message: "Status must be a valid JointRoomStatus enum value.",
    })
    status?: JointRoomStatus;
}
