import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional } from "class-validator";

export class GetTaxesDto {
    @IsOptional()
    @IsNumber()
    @ApiProperty({
        description: "page-number of the list of taxes",
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
        description: "fetch hotel wise",
        type: Number,
        required: true,
    })
    sbu_id: number;
}

export class GetTaxAmount {
    @ApiProperty({
        description: "input amount to calculate tax on",
        type: Number,
        required: true,
        example: 1000.00
    })
    @IsNumber()
    amount: number;
}
