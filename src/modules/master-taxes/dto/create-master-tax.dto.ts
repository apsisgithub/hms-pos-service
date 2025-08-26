// src/modules/master-tax/dto/create-master-tax.dto.ts

import { ApiProperty, PartialType } from "@nestjs/swagger";
import {
    IsString,
    Length,
    IsNotEmpty,
    IsInt,
    IsOptional,
    IsEnum,
    IsNumber,
    IsDateString,
    IsBoolean,
    Min,
} from "class-validator";
import { Type } from "class-transformer";
import {
    TaxStatus,
    TaxApplyTime,
    TaxType,
} from "../entities/master_tax.entity";

export class CreateMasterTaxDto {
    @ApiProperty({
        description: "ID of the SBU this tax belongs to",
        example: 101,
    })
    @IsInt()
    @IsNotEmpty()
    sbu_id: number;

    @ApiProperty({
        description: "Short name for the Tax Rate (e.g., VAT10)",
        maxLength: 20,
        example: "VAT10",
    })
    @IsString()
    @IsNotEmpty()
    @Length(1, 20)
    short_name: string;

    @ApiProperty({
        description:
            "Full Tax name for the Tax Rate (e.g., Value Added Tax 10%)",
        maxLength: 100,
        example: "Value Added Tax 10%",
    })
    @IsString()
    @IsNotEmpty()
    @Length(1, 100)
    name: string;

    @ApiProperty({
        description: "Starting date for the new Tax to be applied (YYYY-MM-DD)",
        example: "2025-01-01",
    })
    @IsDateString()
    @IsNotEmpty()
    applies_from: string;

    @ApiProperty({
        description: "Minimum day range for Tax exemption (number of days)",
        required: false,
        example: 3,
    })
    @IsOptional()
    @IsInt()
    @Min(0)
    exempt_after_days?: number;

    @ApiProperty({
        description: "How the tax will be applied",
        enum: TaxType,
        example: TaxType.Percentage,
    })
    @IsEnum(TaxType)
    @IsNotEmpty()
    tax_type: TaxType;

    @ApiProperty({
        description: "Set the time for when the tax will be added",
        enum: TaxApplyTime, // Corrected to include 'Other'
        example: TaxApplyTime.DuringCheckout, // Or TaxApplyTime.Other
    })
    @IsEnum(TaxApplyTime)
    @IsNotEmpty()
    apply_tax: TaxApplyTime;

    @ApiProperty({
        description: "Option to apply the TAX on Rack Rate",
        default: false,
        example: true,
    })
    @IsBoolean()
    @IsNotEmpty()
    @Type(() => Boolean)
    apply_on_rack_rate: boolean;

    @ApiProperty({
        description: "Important note regarding User’s requirement",
        required: false,
        example: "Breakfast will be served in room",
    })
    @IsOptional()
    @IsString()
    note?: string;

    @ApiProperty({
        description:
            "Set after which amount, the TAX will be applied (e.g., 5000.00)",
        required: false,
        type: "number",
        format: "float",
        example: 5000.0,
    })
    @IsOptional()
    @IsNumber()
    @Min(0)
    @Type(() => Number)
    apply_after_amount?: number;
    

    @ApiProperty({
        description: "Tax rate (percentage value like 10.5 for 10.5% or fixed amount like 100.00)",
        required: true,
        type: "number",
        format: "float",
        example: 10.5,
    })
    @IsNumber()
    @IsNotEmpty()
    @Min(0)
    @Type(() => Number)
    tax_rate: number;

    @ApiProperty({
        description: "Status of the tax",
        enum: TaxStatus,
        default: TaxStatus.Active,
        example: TaxStatus.Active,
    })
    @IsEnum(TaxStatus)
    @IsOptional()
    status?: TaxStatus = TaxStatus.Active;
}

export class UpdateMasterTaxDto extends PartialType(CreateMasterTaxDto) {}
