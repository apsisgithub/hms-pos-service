import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsNumber } from "class-validator";
import { Type } from "class-transformer";

export class GetCreditCardsDto {
    @ApiProperty({
        description: "Filter by SBU ID",
        required: false,
        example: 1,
    })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    sbu_id?: number;

    @ApiProperty({
        description: "Page number for pagination",
        required: false,
        example: 1,
    })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    page_number?: number;

    @ApiProperty({
        description: "Number of items per page",
        required: false,
        example: 10,
    })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    limit?: number;

    @ApiProperty({
        description: "Filter by reservation ID",
        required: false,
        example: 1,
    })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    reservation_id?: number;
}