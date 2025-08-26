import { ApiProperty, PartialType } from "@nestjs/swagger";
import {
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsEnum,
    IsString,
    Length,
    Min,
    IsBoolean,
    IsNumber,
    ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

// Import Enums from your entity file
import {
    BillingType,
    ReservationBookingType,
} from "../entities/master-reservation-billing-info.entity";

export enum CommissionPlan {
    COFRIRM_BOOKING = "Confirm Booking",
    NON_REFUNDABLE = "Non Refundable",
    CORPORATE = "Corporate",
}

export class SourceInfoDto {
    @ApiProperty({
        description: "Market code for reference",
        required: false,
    })
    @IsOptional()
    @IsNumber()
    market_code_id?: number;

    @ApiProperty({
        required: false,
        maxLength: 20,
    })
    @IsOptional()
    @IsNumber()
    business_source_id?: number;

    @ApiProperty({
        required: false,
        maxLength: 20,
    })
    @IsOptional()
    @IsNumber()
    travel_agent_id?: number;

    @ApiProperty({
        required: false,
        maxLength: 20,
    })
    @IsOptional()
    @IsString()
    voucher_no?: string;

    @ApiProperty({
        required: false,
        maxLength: 20,
        default: CommissionPlan.COFRIRM_BOOKING,
    })
    @IsOptional()
    @IsEnum(CommissionPlan)
    commission_plan?: CommissionPlan;

    @ApiProperty({
        required: false,
        maxLength: 20,
    })
    @IsOptional()
    @IsNumber()
    plan_value?: number;

    @ApiProperty({
        required: false,
        maxLength: 20,
    })
    @IsOptional()
    @IsNumber()
    company_id?: number;

    @ApiProperty({
        required: false,
    })
    @IsOptional()
    @IsNumber()
    sales_person_id?: number;
}
export class CreateReservationBillingDetailDto {
    @ApiProperty({
        description: "ID of the Reservation this billing detail belongs to",
        example: 1,
    })
    @IsInt()
    @IsNotEmpty()
    reservation_id: number;

    @ApiProperty({
        description: "Type of billing (Cash/Bank or City Ledger)",
        enum: BillingType,
        default: BillingType.CASH_BANK,
        example: BillingType.CASH_BANK,
    })
    @IsEnum(BillingType)
    @IsNotEmpty()
    billing_type: BillingType = BillingType.CASH_BANK;

    @ApiProperty({
        description: "ID of the payment modes",
        example: 1,
    })
    @IsInt()
    @IsNotEmpty()
    payment_mode_id: number;

    @ApiProperty({
        description:
            "Registration number associated with the billing (e.g., company registration)",
        maxLength: 100,
        required: false,
        example: "234923480",
    })
    @IsOptional()
    @IsString()
    @Length(1, 100)
    registration_no?: string;

    @ApiProperty({
        description:
            "Type of reservation booking (Confirm Booking, Tentative Booking, Cancelled)",
        enum: ReservationBookingType,
        default: ReservationBookingType.HOLD_CONFIRM_BOOKING,
        example: ReservationBookingType.HOLD_CONFIRM_BOOKING,
    })
    @IsEnum(ReservationBookingType)
    @IsNotEmpty()
    reservation_type: ReservationBookingType;

    @ApiProperty({
        description: "ID of the associated Rate Plan/Package",
        required: false,
        example: 5,
    })
    @IsOptional()
    @IsInt()
    @Min(1) // Assuming IDs are positive integers
    @Type(() => Number) // Ensure transformation from string to number
    rate_plan_package_id?: number;

    @ApiProperty()
    @IsOptional()
    @IsString()
    rate_plan_package_details?: string;

    @ApiProperty({
        description: "Whether to send an email upon checkout",
        required: false,
        example: true,
    })
    @IsOptional()
    @IsBoolean()
    send_checkout_email?: boolean;

    @ApiProperty({
        description: "ID of the email template to be used for checkout email",
        required: false,
        example: 3,
    })
    @IsOptional()
    @IsInt()
    checkout_email_template_id?: number;

    @ApiProperty({
        required: false,
        example: true,
    })
    @IsOptional()
    @IsBoolean()
    suppress_rate_on_gr_card?: boolean;

    @ApiProperty({
        required: false,
        example: true,
    })
    @IsOptional()
    @IsBoolean()
    display_inclusion_separately_on_folio?: boolean;

    @ApiProperty({
        required: false,
        example: true,
    })
    @IsOptional()
    @IsBoolean()
    apply_to_group?: boolean;

    @ApiProperty({
        description:
            "ID of the MasterGuest associated with this billing detail (Bill To)",
        required: false,
        example: 101,
    })
    @IsOptional()
    @IsInt()
    @Min(1)
    @Type(() => Number)
    guest_id?: number;

    @ApiProperty({
        description: "Source information details",
        required: false,
        type: () => SourceInfoDto,
    })
    @IsOptional()
    @ValidateNested()
    @Type(() => SourceInfoDto)
    sources?: SourceInfoDto;
}
