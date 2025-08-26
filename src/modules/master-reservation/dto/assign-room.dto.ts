import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";
import { Type } from "class-transformer";

export class AssignRoomDto {
    @ApiProperty({
        description: "ID of the reservation",
        example: 1,
    })
    @IsNumber()
    @Type(() => Number)
    reservation_id: number;

    @ApiProperty({
        description: "ID of the room to assign",
        example: 1,
    })
    @IsNumber()
    @Type(() => Number)
    room_id: number;
}