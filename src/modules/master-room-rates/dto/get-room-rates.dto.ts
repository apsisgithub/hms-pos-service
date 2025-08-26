import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class GetRoomRatesDto {
    @IsOptional()
    @IsNumber()
    @ApiProperty({
        description: "page-number of the list of room rates",
        type: Number,
        required: false,
    })
    page_number?: number;

    @IsOptional()
    @IsNumber()
    @ApiProperty({
        description: "limit for fetching limited number of data",
        type: Number,
        required: false,
    })
    limit?: number;

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({
        description: "sbu_id for fetching hotel wise",
        type: Number,
        required: false,
    })
    sbu_id: number;
}
