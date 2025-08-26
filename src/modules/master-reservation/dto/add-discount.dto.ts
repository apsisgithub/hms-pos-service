import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class AddDiscountDto {
    @ApiProperty({
        description: "ID of the discount type",
        example: 1,
    })
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    discount_id: number;

    @ApiProperty({
        description: "Amount of discount to apply",
        example: 50.00,
    })
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    discount_amount: number;

    @ApiProperty({
        description: "ID of the folio to apply discount to",
        example: 1,
    })
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    folio_id: number;

    @ApiProperty({
        description: "Description or reason for the discount",
        example: "Senior citizen discount",
        required: false,
    })
    @IsOptional()
    @IsString()
    description: string='';
}