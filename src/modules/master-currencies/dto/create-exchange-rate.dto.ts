import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsNumber, IsPositive } from "class-validator";

export class CreateExchangeRatesDto {
    @ApiProperty({})
    @IsNumber()
    @IsNotEmpty()
    sbu_id: number;

    @ApiProperty({
        description: "The country associated with the currency.",
        example: "Bangladesh",
    })
    @IsString()
    @IsNotEmpty()
    country: string;

    @ApiProperty({
        example: "Bangladeshi Taka",
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({

        description: "The currency code (e.g., BDT).",
        example: "BDT",
    })
    @IsString()
    @IsNotEmpty()
    currency_code: string;

    @ApiProperty({
        description: "The number of digits to display after the decimal point.",
        example: "2",
    })
    @IsString()
    @IsNotEmpty()
    digits_after_decimal: string;

    @ApiProperty({
        description: "The exchange rate relative to the base currency.",
        example: 1.0,
        type: Number,
    })
    @IsNumber()
    @IsNotEmpty()
    @IsPositive()
    base_exchange_rate: number;

    @ApiProperty({
        description: "The exchange rate relative to the US Dollar.",
        example: 109.5,
        type: Number,
    })
    @IsNumber()
    @IsNotEmpty()
    @IsPositive()
    dollar_exchange_rate: number;
}
