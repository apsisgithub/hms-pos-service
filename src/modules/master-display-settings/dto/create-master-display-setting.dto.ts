import {
    IsString,
    IsOptional,
    IsBoolean,
    IsNumber,
    IsEnum,
    IsNotEmpty,
    Length,
    Min,
} from "class-validator";
import { ApiProperty, PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
    DisplaySettingStatus,
    DateFormat,
    TimeFormat,
    ArrDeptDateFormat,
    WebRateMode,
    GroupPaymentPostingMode,
    RoundOffType,
    SalutationType,
    IdentityType,
    DefaultReservationType,
    BillToType,
    PaymentMode,
    PaymentGateway,
} from "../entities/master_display_settings.entity";

export class CreateMasterDisplaySettingDto {
    @ApiProperty({
        description: "The SBU ID associated with the display setting.",
        example: 1,
    })
    @IsNotEmpty()
    @IsNumber()
    sbu_id: number;

    @ApiProperty({
        description: "Date format for general use.",
        enum: DateFormat,
        default: DateFormat.DD_MM_YYYY,
    })
    @IsEnum(DateFormat)
    @IsNotEmpty()
    date_format: DateFormat;

    @ApiProperty({
        description: "Time format for general use.",
        enum: TimeFormat,
        default: TimeFormat.HH_MM_24,
    })
    @IsEnum(TimeFormat)
    @IsNotEmpty()
    time_format: TimeFormat;

    @ApiProperty({
        description: "Time zone for the SBU.",
        required: false,
        example: "GMT-03:00 Brazil Time (America/Fortaleza)",
    })
    @IsOptional()
    @IsString()
    @Length(1, 100)
    timezone?: string;

    @ApiProperty({
        description: "Date format for arrival and departure.",
        enum: ArrDeptDateFormat,
        default: ArrDeptDateFormat.DD_MM_YYYY,
    })
    @IsEnum(ArrDeptDateFormat)
    @IsNotEmpty()
    arr_dept_date_format: ArrDeptDateFormat;

    @ApiProperty({
        description: "JSON object representing weekend days.",
        required: false,
        example: '{"Sun":true, "Sat":true}',
    })
    @IsOptional()
    @IsString() // Use string for JSON object in DTO
    weekend_days?: string;

    @ApiProperty({
        description: "Type of rounding to apply.",
        enum: RoundOffType,
        default: RoundOffType.NO_ROUND_OFF,
    })
    @IsEnum(RoundOffType)
    @IsNotEmpty()
    round_off_type: RoundOffType;

    @ApiProperty({
        description: "Limit for rounding off.",
        required: false,
        example: 10,
    })
    @IsOptional()
    @IsNumber()
    @Min(0)
    @Type(() => Number)
    round_off_limit?: number;

    @ApiProperty({
        description: "Flag to add up rounding off to rates.",
        required: false,
        example: false,
    })
    @IsOptional()
    @IsBoolean()
    @Type(() => Boolean)
    add_up_round_off_to_rates?: boolean;

    @ApiProperty({
        description: "Default salutation type.",
        enum: SalutationType,
        default: SalutationType.MR,
    })
    @IsEnum(SalutationType)
    @IsNotEmpty()
    salutation: SalutationType;

    @ApiProperty({
        description: "Default identity type for guests.",
        enum: IdentityType,
        default: IdentityType.NID,
    })
    @IsEnum(IdentityType)
    @IsNotEmpty()
    identity_type: IdentityType;

    @ApiProperty({
        description: "Default reservation type.",
        enum: DefaultReservationType,
        default: DefaultReservationType.CONFIRM_BOOKING,
    })
    @IsEnum(DefaultReservationType)
    @IsNotEmpty()
    default_reservation_type: DefaultReservationType;

    @ApiProperty({
        description: "Default 'Bill To' type.",
        required: false,
        enum: BillToType,
        example: BillToType.GUEST,
    })
    @IsOptional()
    @IsEnum(BillToType)
    bill_to?: BillToType;

    @ApiProperty({
        description: "Caption for the state field.",
        required: false,
        example: "State",
    })
    @IsOptional()
    @IsString()
    @Length(1, 100)
    state_caption?: string;

    @ApiProperty({
        description: "Caption for the zip code field.",
        required: false,
        example: "Zip Code",
    })
    @IsOptional()
    @IsString()
    @Length(1, 100)
    zip_code_caption?: string;

    @ApiProperty({
        description: "Flag to indicate if tax is inclusive in rates.",
        required: false,
        example: false,
    })
    @IsOptional()
    @IsBoolean()
    @Type(() => Boolean)
    is_tax_inclusive_rates?: boolean;

    @ApiProperty({
        description: "Web rate mode for online bookings.",
        enum: WebRateMode,
        default: WebRateMode.Regular,
    })
    @IsEnum(WebRateMode)
    @IsOptional()
    web_rate_mode: WebRateMode;

    @ApiProperty({
        description: "Web room inventory mode for online bookings.",
        enum: WebRateMode,
        default: WebRateMode.Regular,
    })
    @IsEnum(WebRateMode)
    @IsNotEmpty()
    web_room_inventory_mode: WebRateMode;

    @ApiProperty({
        description: "Mode for posting group payments.",
        enum: GroupPaymentPostingMode,
        default: GroupPaymentPostingMode.GroupOwner,
    })
    @IsEnum(GroupPaymentPostingMode)
    @IsNotEmpty()
    group_payment_posting_mode: GroupPaymentPostingMode;

    @ApiProperty({
        description:
            "Flag to make registration number mandatory for travel agents.",
        required: false,
        example: false,
    })
    @IsOptional()
    @IsBoolean()
    @Type(() => Boolean)
    registration_no_mandatory_for_travel_agent?: boolean;

    @ApiProperty({
        description: "Payment mode.",
        required: false,
        enum: PaymentMode,
        example: PaymentMode.CASH_BANK,
    })
    @IsOptional()
    @IsEnum(PaymentMode)
    payment_mode?: PaymentMode;

    @ApiProperty({
        description: "Payment gateway.",
        required: false,
        enum: PaymentGateway,
        example: PaymentGateway.COMMON_PG,
    })
    @IsOptional()
    @IsEnum(PaymentGateway)
    payment_gateway?: PaymentGateway;

    @ApiProperty({
        description: "Default country.",
        required: false,
        example: "Brazil",
    })
    @IsOptional()
    @IsString()
    @Length(1, 100)
    country?: string;

    @ApiProperty({
        description: "Default nationality.",
        required: false,
        example: "Brazilian",
    })
    @IsOptional()
    @IsString()
    @Length(1, 100)
    nationality?: string;

    @ApiProperty({
        description: "Generate invoice on checkout.",
        required: false,
        default: false,
    })
    @IsOptional()
    @IsBoolean()
    generate_invoice_on_checkout?: boolean;

    @ApiProperty({
        description: "Generate invoice on cancel.",
        required: false,
        default: false,
    })
    @IsOptional()
    @IsBoolean()
    generate_invoice_on_cancel?: boolean;

    @ApiProperty({
        description: "Generate invoice on no show.",
        required: false,
        default: false,
    })
    @IsOptional()
    @IsBoolean()
    generate_invoice_on_no_show?: boolean;

    @ApiProperty({
        description: "Generate single invoice for groups.",
        required: false,
        default: false,
    })
    @IsOptional()
    @IsBoolean()
    generate_single_invoice_for_groups?: boolean;

    @ApiProperty({
        description: "No charge/void charge folio.",
        required: false,
        default: false,
    })
    @IsOptional()
    @IsBoolean()
    no_charge_void_charge_folio?: boolean;

    @ApiProperty({
        description: "Status of the display setting.",
        enum: DisplaySettingStatus,
        default: DisplaySettingStatus.Active,
    })
    @IsEnum(DisplaySettingStatus)
    @IsNotEmpty()
    status: DisplaySettingStatus;
}
