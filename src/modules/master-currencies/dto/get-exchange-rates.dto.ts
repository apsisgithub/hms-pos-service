import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional } from "class-validator";

export class GetExchangeRatesDto {
    @IsOptional()
    @IsNumber()
    @ApiProperty({
        description: "page-number of the list of exchanges",
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

    @IsOptional()
    @IsNumber()
    @ApiProperty({
        description: "fetch exchanges sbu-wise",
        type: Number,
        required: true,
    })
    sbu_id: number;
}
