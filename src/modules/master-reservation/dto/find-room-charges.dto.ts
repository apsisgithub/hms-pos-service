import { IsNotEmpty, IsNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class FindRoomChargesDto {
    @ApiProperty({
        description: "ID of the reservation to fetch room charges for",
        example: 1,
    })
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    reservation_id: number;

    @ApiProperty({
        description: "ID of the room to fetch room charges for",
        example: 1,
    })
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    room_id: number;
}
