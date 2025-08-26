import { IsOptional, IsNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class GetFoliosDto {
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
        description: "Filter by reservation ID",
        required: false,
        example: 1,
    })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    reservation_id?: number;

    @ApiProperty({
        description: "Filter by guest ID",
        required: false,
        example: 1,
    })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    guest_id?: number;

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
    limit?: number;
}