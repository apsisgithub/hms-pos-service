import {
    IsBoolean,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
    ChargeType,
    PostingType,
    ChargeRule,
} from "../entities/master_charges.entity";

export class CreateChargeDto {
    @ApiProperty({
        description: "ID of the SBU (Strategic Business Unit)",
        example: 1,
    })
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    sbu_id: number;

    @ApiProperty({
        description: "ID of the folio",
        required: false,
        example: 1,
    })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    folio_id?: number;

    @ApiProperty({
        description: "Charge amount",
        example: 150.75,
    })
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    amount: number;

    @ApiProperty({
        description: "Description of the charge",
        example: "Room service charge",
    })
    @IsNotEmpty()
    @IsString()
    description: string;

    @ApiProperty({
        description: "Type of charge",
        enum: ChargeType,
        example: ChargeType.ROOM_CHARGES,
    })
    @IsNotEmpty()
    @IsEnum(ChargeType)
    type: ChargeType;

    @ApiProperty({
        description: "Posting type for the charge",
        enum: PostingType,
        example: PostingType.EVERY_DAY,
    })
    @IsNotEmpty()
    @IsEnum(PostingType)
    posting_type: PostingType;

    @ApiProperty({
        description: "Charge rule",
        enum: ChargeRule,
        example: ChargeRule.PER_PERSON,
    })
    @IsNotEmpty()
    @IsEnum(ChargeRule)
    charge_rule: ChargeRule;

    @ApiProperty({
        description: "Tax included or not",
        default: false,
    })
    @IsNotEmpty()
    @IsBoolean()
    is_tax_included?: boolean = false;
}
