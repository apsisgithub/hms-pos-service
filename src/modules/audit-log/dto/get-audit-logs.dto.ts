import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class GetAuditLogsDto {
    @ApiProperty({
        description: "ID of the reservation to fetch logs for",
        example: 1,
    })
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    reservation_id: number;

    @ApiProperty({
        description: "ID of the reservation to fetch logs for",
        example: 1,
    })
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    room_id: number;

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
        example: 20,
    })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    limit?: number = 20;
}
