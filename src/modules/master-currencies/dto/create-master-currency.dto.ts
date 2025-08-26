import { ApiProperty, PartialType } from "@nestjs/swagger";
import {
    IsString,
    Length,
    IsNotEmpty,
    IsInt,
    IsOptional,
    IsNumber,
    IsBoolean,
    Min,
    IsEnum,
} from "class-validator";
import { Type } from "class-transformer";
import { CurrencyStatus } from "src/modules/master-currencies/entities/master_currencies.entity";

export class CreateMasterCurrencyDto {
    @ApiProperty({ description: "ID of the SBU this currency belongs to" })
    @IsInt()
    @IsNotEmpty()
    sbu_id: number;

    @ApiProperty({
        description: "name of the country associated with this currency",
    })
    @IsString()
    @IsNotEmpty()
    country: string;

    @ApiProperty({
        description: "Currency code (e.g., USD, BDT)",
        maxLength: 10,
    })
    @IsString()
    @IsNotEmpty()
    @Length(1, 10)
    currency_code: string;

    @ApiProperty({
        description: "Currency Name",
        maxLength: 10,
    })
    @IsString()
    @IsNotEmpty()
    @Length(1, 10)
    currency: string;

    @ApiProperty({
        description: "Currency sign or symbol (e.g., $, ৳)",
        maxLength: 10,
        required: false,
    })
    @IsOptional()
    @IsString()
    @Length(1, 10)
    sign?: string;

    @ApiProperty({
        description:
            "Whether the currency sign is shown before the value (true) or after (false)",
        default: true,
    })
    @IsOptional()
    @IsBoolean()
    is_sign_prefix?: boolean = true;

    @ApiProperty({
        description: "Number of digits after the decimal point",
        default: 2,
    })
    @IsInt()
    @IsNotEmpty()
    digits_after_decimal: number = 2;

    @ApiProperty({
        description: "Exchange rate relative to the base currency",
        type: "number",
        format: "float",
    })
    @IsNumber()
    @IsNotEmpty()
    @Type(() => Number)
    base_exchange_rate: number;

    @ApiProperty({
        description: "Exchange rate relative to USD",
        type: "number",
        format: "float",
    })
    @IsNumber()
    @IsNotEmpty()
    @Type(() => Number)
    dollar_exchange_rate: number;

    @ApiProperty({
        description: "Status of the currency",
        enum: CurrencyStatus,
        default: CurrencyStatus.Active,
    })
    @IsEnum(CurrencyStatus)
    @IsNotEmpty()
    status: CurrencyStatus = CurrencyStatus.Active;
}
