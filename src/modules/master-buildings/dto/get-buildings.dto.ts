import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional } from "class-validator";

export class GetBuildingsDto {
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
        description: "fetch hotel wise",
        type: Number,
        required: true,
    })
    sbu_id: number;
}
