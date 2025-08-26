import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional } from "class-validator";

export class GetFloorsDto {
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

    @IsOptional()
    @IsNumber()
    @ApiProperty({
        description: "sbu_id",
        type: Number,
        required: false,
    })
    sbu_id?: number;
}
