import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsNumber } from "class-validator";

export class GetStatusWiseRoomCountDto {
    @IsOptional()
    @IsNumber()
    @ApiProperty({
        description: "SBU ID to filter rooms by specific SBU",
        type: Number,
        required: false,
        example: 1
    })
    sbu_id: number;
}

export class GetStatusWiseReservationRoomCountDto extends GetStatusWiseRoomCountDto{
    @IsOptional()
    @IsNumber()
    @ApiProperty({
        description: "Reservation ID",
        type: Number,
        required: false,
        example: 1
    })
    reservation_id: number;
}