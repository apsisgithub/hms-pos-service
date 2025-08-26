import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class GetRoomDetailsTreeDto {
    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({
        description: "room type id is required to fetch all details",
        type: Number,
        required: false,
    })
    room_type_id?: number;
}
