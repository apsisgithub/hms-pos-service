import { ApiProperty } from "@nestjs/swagger";
import {
    IsString,
    IsNotEmpty,
    IsNumber,
    IsBoolean,
    IsOptional,
    IsEnum,
    IsArray,
    IsDateString,
    ArrayMinSize,
    IsDate,
} from "class-validator";
import { Type } from "class-transformer";

// Enums from the entity for type safety and validation
export enum RateType {
    FLAT_PERCENTAGE = "Flat Percentage",
    FLAT_AMOUNT = "Flat Amount",
}

export enum ApplyOnOfferedRoomRentType {
    NET_RATE = "Net Rate",
    SELL_RATE = "Sell Rate",
}

export enum VoucherNoType {
    AUTO_PRIVATE = "Auto - Private",
    AUTO_General = "Auto - General",
    MANUAL = "Manual",
}

export enum PostingRuleType {
    CHECK_IN_AND_CHECK_OUT = "CheckIn and CheckOut",
    EVERYDAY = "Everyday",
    EVERY_DAY_EXCEPT_CHECK_IN = "Everyday except CheckIn",
    ONLY_CHECK_IN = "Only CheckIn",
    ONLY_CHECK_OUT = "Only CheckOut",
}

export enum ExtraChargesStatus {
    ACTIVE = "Active",
    INACTIVE = "Inactive",
}

export class CreateMasterExtraChargeDto {
    @ApiProperty({
        description: "A short code for the extra charge.",
        example: "MINIBAR",
    })
    @IsString()
    @IsNotEmpty()
    short_code: string;

    @ApiProperty({})
    @IsNotEmpty()
    @IsNumber()
    sbu_id: number;

    @ApiProperty({
        description: "The name of the extra charge.",
        example: "Minibar Service",
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        description: "The type of rate to apply.",
        enum: RateType,
        example: RateType.FLAT_AMOUNT,
    })
    @IsEnum(RateType)
    @IsNotEmpty()
    rate: RateType;

    @ApiProperty({
        description: "A sort key for the Front Desk.",
        example: 1,
        required: false,
    })
    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    front_desk_sort_key: number;

    @ApiProperty({
        description: "Whether the charge is a fixed price.",
        example: true,
    })
    @IsBoolean()
    @IsNotEmpty()
    is_fixed_price: boolean;

    @ApiProperty({
        description:
            "The value of the rate, interpreted based on the rate type.",
        example: 25.5,
        required: false,
    })
    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    rate_value: number;

    @ApiProperty({
        description: "Whether to apply the charge as a Net Rate or Sell Rate.",
        enum: ApplyOnOfferedRoomRentType,
        example: ApplyOnOfferedRoomRentType.SELL_RATE,
    })
    @IsEnum(ApplyOnOfferedRoomRentType)
    @IsNotEmpty()
    apply_on_offered_room_rent: ApplyOnOfferedRoomRentType;

    @ApiProperty({
        description: "An array of tax types ID to apply to the charge.",
        example: [1, 2],
        isArray: true,
        required: false,
    })
    @IsArray()
    @IsOptional()
    @IsNumber({}, { each: true })
    taxes: number[];

    @ApiProperty({
        description: "The tax rate inclusive of the total rate.",
        example: 10,
        required: false,
    })
    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    rate_inclusive_tax: number;

    @ApiProperty({
        description: "Whether to publish the charge on the web.",
        example: true,
    })
    @IsBoolean()
    @IsOptional()
    publish_on_web: boolean;

    @ApiProperty({
        description: "Whether to always apply this charge.",
        example: false,
    })
    @IsBoolean()
    @IsOptional()
    always_charge: boolean;

    @ApiProperty({
        description: "The type of voucher number to use.",
        enum: VoucherNoType,
        example: VoucherNoType.AUTO_PRIVATE,
    })
    @IsEnum(VoucherNoType)
    @IsNotEmpty()
    voucher_no_type: VoucherNoType;

    @ApiProperty({
        description: "A prefix for the voucher number.",
        example: "VOU-",
        required: false,
    })
    @IsString()
    @IsOptional()
    voucher_prefix: string;

    @ApiProperty({
        description: "The start number for the voucher.",
        example: 1000,
        required: false,
    })
    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    voucher_start_from: number;

    @ApiProperty({
        description: "Where the charge applies on the web.",
        example: "Room",
        required: false,
    })
    @IsString()
    @IsOptional()
    web_applies_on: string;

    @ApiProperty({
        description: "The posting rule for the web charge.",
        enum: PostingRuleType,
        example: PostingRuleType.EVERYDAY,
        required: false,
    })
    @IsEnum(PostingRuleType)
    @IsOptional()
    web_posting_rule: PostingRuleType;

    @ApiProperty({
        description: "A brief description of the charge for the web.",
        example: "This charge covers minibar items consumed during the stay.",
        required: false,
    })
    @IsString()
    @IsOptional()
    web_description: string;

    @ApiProperty({
        description: "A sort key for the Web Reservation system.",
        example: 1,
        required: false,
    })
    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    web_res_sort_key: number;

    @ApiProperty({
        description: "The start date for when the web charge is valid.",
        example: "2025-08-01",
        required: false,
    })
    @IsDate()
    @IsOptional()
    web_valid_from: Date;

    @ApiProperty({
        description: "The end date for when the web charge is valid.",
        example: "2026-08-01",
        required: false,
    })
    @IsDate()
    @IsOptional()
    web_valid_to: Date;

    @ApiProperty({
        description: "The status of the extra charge.",
        enum: ExtraChargesStatus,
        example: ExtraChargesStatus.ACTIVE,
    })
    @IsEnum(ExtraChargesStatus)
    @IsNotEmpty()
    status: ExtraChargesStatus;
}
