import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsNumber, IsDateString, IsOptional } from "class-validator";
import { Type } from "class-transformer";
import { AddCardDto } from "./add-card.dto";

export class ChargeCardDto extends PartialType(AddCardDto) {
    @ApiProperty({
        description: "Amount to charge",
        example: 250.75,
    })
    @IsNumber({ maxDecimalPlaces: 2 })
    @Type(() => Number)
    charge_amount: number;

    @ApiProperty({
        example: 405,
        required: false,
    })
    @IsNumber()
    @IsOptional()
    folio_id: number;

    @ApiProperty({
        description: "Date of the charge (YYYY-MM-DD)",
        example: "2025-07-31",
    })
    @IsDateString()
    charge_date: string;

    @ApiProperty({
        description: "ID of the currency",
        example: 1,
    })
    @IsNumber()
    @Type(() => Number)
    currency_id: number;

    @ApiProperty({
        description: "ID of the credit card",
        example: 1,
    })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    credit_card_id: number;
}
