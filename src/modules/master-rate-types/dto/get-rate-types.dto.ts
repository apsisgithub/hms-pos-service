import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional } from "class-validator";

export class GetRateTypesDto {
    @IsOptional()
    @IsNumber()
    @ApiProperty({
        description: "page-number of the list of rate types",
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

    @IsOptional()
    @IsNumber()
    @ApiProperty({
        description: "fetch room wise",
        type: Number,
        required: false,
    })
    room_type_id?: number;
}
