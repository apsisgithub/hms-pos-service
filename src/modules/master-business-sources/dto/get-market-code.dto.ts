import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class GetMarketCodeDto {
    @IsOptional()
    @IsNumber()
    @ApiProperty({
        description: "page-number of the list of market-codes",
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
        description: "fetch hotel wise",
        type: Number,
        required: true,
    })
    sbu_id: number;
}
