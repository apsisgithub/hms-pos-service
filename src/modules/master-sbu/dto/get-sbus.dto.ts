import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsArray, IsInt } from "class-validator";
import { Type } from "class-transformer";

export class GetSbusDto {
    @IsOptional()
    @IsNumber()
    @ApiProperty({
        description: "page-number of the list of SBUs",
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
    @IsArray()
    @IsInt({ each: true })
    @Type(() => Number)
    @ApiProperty({
        description: "List of SBU IDs to filter by",
        type: [Number],
        required: false,
        example: [1, 2, 3]
    })
    sbu_ids?: number[];
}
