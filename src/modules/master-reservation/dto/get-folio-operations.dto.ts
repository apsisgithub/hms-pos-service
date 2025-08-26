import { IsNotEmpty, IsOptional, IsNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class GetFolioOperationsDto {
    @ApiProperty({
        description: "Filter by folio ID",
        required: true,
        example: 1,
    })
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    folio_id: number;

    @ApiProperty({
        description: "Page number for pagination",
        required: false,
        example: 1,
    })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    page_number?: number = 1;

    @ApiProperty({
        description: "Number of items per page",
        required: false,
        example: 10,
    })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    limit?: number = 10;
}