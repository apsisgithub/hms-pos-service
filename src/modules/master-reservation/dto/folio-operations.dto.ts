import { IsOptional, IsNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class TransferFolioOperationsDto {
    
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