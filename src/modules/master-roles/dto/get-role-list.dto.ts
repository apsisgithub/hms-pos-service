import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional } from "class-validator";

export class GetRolesDto {
    @IsOptional()
    @IsNumber()
    @ApiProperty({
        description: "page-number of the list of employee summary",
        type: Number,
        required: false,
    })
    page_number?: number;

    @IsOptional()
    @IsNumber()
    @ApiProperty({
        description: "offset for fetching remaining data from the db",
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
