import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";
export class GetReservationSourcesInfoDto {
    @IsOptional()
    @IsNumber()
    @ApiProperty({
        description: "page-number of the list of buildings",
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
        description: "fetch reservation wise",
        type: Number,
        required: true,
    })
    reservation_id: number;
}
