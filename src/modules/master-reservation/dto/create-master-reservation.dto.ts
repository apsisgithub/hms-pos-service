// src/reservations/dto/create-reservation.dto.ts
import {
    IsString,
    IsOptional,
    IsNumber,
    IsBoolean,
    IsDateString,
    Min,
    IsDate,
    IsArray,
    ValidateNested,
    IsEnum,
    IsNotEmpty,
    Max,
} from "class-validator";
import { ApiProperty, PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { CreateMasterGuestDto } from "src/modules/master-guests/dto/create-master-guest.dto";
import { ChargeCardDto } from "./charge-card.dto";
import { CreateChargeDto } from "./create-charge.dto";
import { AddCardDto } from "./add-card.dto";
import { IsDateAfter } from "src/common/decorators/check-date-after.decorator";

export class RoomDetailsDto {
    @ApiProperty({
        description: "ID of the room",
        example: 1,
    })
    @IsNumber()
    @Type(() => Number)
    room_id: number;

    @ApiProperty({
        description: "ID of the rate type",
        example: 1,
    })
    @IsNumber()
    @Type(() => Number)
    rate_type_id: number;

    @ApiProperty({
        description: "ID of the room type id",
        example: 1,
    })
    @IsNumber()
    @Type(() => Number)
    room_type_id: number;

    @ApiProperty({
        description: "Room rate",
        example: 150.0,
    })
    @IsNumber({ maxDecimalPlaces: 2 })
    @Type(() => Number)
    rate: number;

    @ApiProperty({
        description: "Number of adults",
        example: 2,
    })
    @IsNumber()
    @Type(() => Number)
    adult_count: number;

    @ApiProperty({
        description: "Number of children",
        example: 1,
    })
    @IsNumber()
    @Type(() => Number)
    child_count: number;

    @ApiProperty({
        description: "is_assigned",
        example: 1,
    })
    @IsBoolean()
    @Type(() => Boolean)
    is_assigned: boolean;
}

export class NewChargeDto extends PartialType(CreateChargeDto) {}

export enum CardType {
    PHYSICAL_CARD = "physical_card",
    VIRTUAL_CARD = "virtual_card",
}
export class CreditCardDto {
    @ApiProperty({
        description: "Credit card number",
        example: "1234567890123456",
    })
    @IsNotEmpty()
    @IsString()
    card_number: string;

    @ApiProperty({ description: "Card holder name", example: "John Doe" })
    @IsNotEmpty()
    @IsString()
    card_holder_name: string;

    @ApiProperty({ description: "Expiry month", example: 12 })
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    @Max(12)
    expiry_month: number;

    @ApiProperty({ description: "Expiry year", example: 2025 })
    @IsNotEmpty()
    @IsNumber()
    expiry_year: number;

    @ApiProperty({ description: "CVV code", example: 123 })
    @IsOptional()
    @IsNumber()
    cvv: number;

    @ApiProperty({
        description: "Card type",
        example: "physical_card",
        default: CardType.PHYSICAL_CARD,
    })
    @IsNotEmpty()
    @IsEnum(CardType)
    card_type: CardType;

    @ApiProperty({ description: "Credit card ID", example: 1 })
    @IsOptional()
    @IsNumber()
    credit_card_id?: number;
}

export class PaymentsDto {
    @ApiProperty({
        description: "Amount to be charged",
        example: 250.75,
    })
    @IsNotEmpty()
    @IsNumber()
    amount: number;

    @ApiProperty({
        description: "Currency ID",
        example: 1,
    })
    @IsNotEmpty()
    @IsNumber()
    currency_id: number;

    @ApiProperty({
        description: "Payment mode ID",
        example: 1,
    })
    @IsNotEmpty()
    @IsNumber()
    payment_mode_id: number;

    @ApiProperty({
        description: "Credit card details",
        type: CreditCardDto,
        required: false,
    })
    @IsOptional()
    @ValidateNested()
    @Type(() => CreditCardDto)
    credit_card?: CreditCardDto;
}

export enum RemarksType {
    Guest = "Guest",
    CheckIn = "Check In",
    CheckOut = "Check Out",
    PaymentNote = "Payment Note",
    HouseKeeping = "House Keeping",
}
export class GuestDetails extends CreateMasterGuestDto {
    @IsOptional()
    @IsNumber()
    @ApiProperty()
    guest_id: number;

    @IsOptional()
    @IsString()
    @ApiProperty()
    remarks?: string;

    @IsOptional()
    @IsEnum(RemarksType, {
        message: `remarks_type must be a valid enum value: ${Object.values(RemarksType).join(", ")}`,
    })
    @ApiProperty({
        description: "The type of remark being made.",
        enum: RemarksType,
        example: RemarksType.Guest,
    })
    remarks_type?: RemarksType;
}

export enum RateType {
    RATE_PER_NIGHT = "Rate Per Night",
    TOTAL_RATE_FOR_STAY = "Total Rate for Stay",
}
export class CreateReservationDto {
    @ApiProperty({
        description:
            "ID of the Strategic Business Unit (SBU) associated with the reservation",
        example: 101,
    })
    @IsNumber()
    @Type(() => Number)
    sbu_id: number;

    @ApiProperty({
        description: "ID of the business agent (if applicable)",
        required: false,
        example: 201,
    })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    business_agent_id?: number;

    @ApiProperty({
        required: true,
        example: RateType.RATE_PER_NIGHT,
        default: RateType.RATE_PER_NIGHT,
    })
    @IsEnum(RateType)
    @IsNotEmpty()
    rate_type: RateType;

    @ApiProperty({
        description: "Total calculated rate for the reservation",
        type: "number",
        format: "float",
        example: 250.75,
    })
    @IsNumber({ maxDecimalPlaces: 2 })
    @Type(() => Number)
    total_calculated_rate: number;

    @ApiProperty({
        required: false,
        example: false,
    })
    @IsOptional()
    @IsBoolean()
    is_rate_includes_taxes?: boolean;

    @ApiProperty({
        description: "Indicates if an extra bed is required",
        required: false,
        example: true,
    })
    @IsOptional()
    @IsBoolean()
    extra_bed_required?: boolean;

    @ApiProperty({
        description: "Indicates if an email should be sent at checkout",
        required: false,
        example: true,
    })
    @IsOptional()
    @IsBoolean()
    send_email_at_checkout?: boolean;

    @ApiProperty({
        description:
            "Indicates if inclusions should be displayed separately on the folio",
        required: false,
        example: false,
    })
    @IsOptional()
    @IsBoolean()
    display_inclusion_separately_on_folio?: boolean;

    @ApiProperty({
        description:
            "Current status of the reservation (e.g., 'Tentative', 'Confirmed', 'CheckedIn', 'CheckedOut', 'Cancelled', 'NoShow')",
        example: "Confirmed",
        required: false,
    })
    @IsString()
    @IsOptional()
    status?: string;

    @ApiProperty({
        description:
            "Current payment status of the reservation (e.g., 'Paid', 'Pending', 'Partially Paid')",
        required: false,
        example: "Paid",
    })
    @IsOptional()
    @IsString()
    payment_status?: string;

    @ApiProperty({
        description:
            "Payment method used (e.g., 'Cash', 'Card', 'Bank Transfer')",
        required: false,
        example: "Credit Card",
    })
    @IsOptional()
    @IsString()
    payment_method?: string;

    @ApiProperty({
        description: "Amount paid in advance for the reservation",
        type: "number",
        format: "float",
        required: false,
        example: 250.75,
    })
    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    @Type(() => Number)
    advance_paid_amount?: number;

    @ApiProperty({
        description:
            "Check-in date and time of the reservation (ISO 8601 format: YYYY-MM-DDTHH:mm:ssZ)",
        type: "string",
        format: "date-time",
        example: "2025-08-10T14:00:00Z",
    })
    @IsDate()
    @Type(() => Date)
    check_in_datetime: Date;

    @ApiProperty({
        description:
            "Check-out date and time of the reservation (ISO 8601 format: YYYY-MM-DDTHH:mm:ssZ)",
        type: "string",
        format: "date-time",
        example: "2025-08-15T12:00:00Z",
    })
    @IsDate()
    @Type(() => Date)
    @IsDateAfter("check_in_datetime", {
        message: "checkout datetime must be after checkin datetime",
    })
    check_out_datetime: Date;

    @ApiProperty({
        description:
            "Date the reservation was made (ISO 8601 format: YYYY-MM-DDTHH:mm:ssZ)",
        type: "string",
        format: "date-time",
        required: false,
        example: "2025-07-29T15:30:00Z",
    })
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    reservation_date?: Date;

    @ApiProperty({
        description:
            'Source of the booking (e.g., "Direct", "OTA", "Travel Agent")',
        required: false,
        example: "Online Travel Agent",
    })
    @IsOptional()
    @IsString()
    booking_source?: string;

    @ApiProperty({
        description:
            'Channel through which the reservation was made (e.g., "Web", "Phone")',
        required: false,
        example: "Booking.com",
    })
    @IsOptional()
    @IsString()
    channel_name?: string;

    @ApiProperty({
        description: "Reference ID from the booking source/channel",
        required: false,
        example: "BOOK123456789",
    })
    @IsOptional()
    @IsString()
    reservation_source_reference?: string;

    @ApiProperty({
        description:
            'Purpose of the booking (e.g., "Leisure", "Business", "Event")',
        required: false,
        example: "Leisure",
    })
    @IsOptional()
    @IsString()
    booking_purpose?: string;

    @ApiProperty({
        description: "Any special requests for the reservation",
        required: false,
        example: "Non-smoking room, high floor preferred.",
    })
    @IsOptional()
    @IsString()
    special_requests?: string;

    // guest_id has been dropped from the schema, so it's removed from the DTO.

    @ApiProperty({
        description: "ID of the business source for this reservation",
        required: false,
        example: 301,
    })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    business_source_id?: number;

    @ApiProperty({
        description: "ID of the payment mode for this reservation",
        required: false,
        example: 401,
    })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    payment_mode_id?: number; // New field

    @ApiProperty({
        required: false,
        example: 401,
    })
    @IsOptional()
    @IsNumber()
    charge_amount: number;

    @ApiProperty({
        required: false,
        example: 401,
    })
    @IsOptional()
    @IsNumber()
    currency_id?: number;

    @ApiProperty({
        required: false,
        example: false,
    })
    @IsOptional()
    @IsBoolean()
    is_day_use?: boolean;

    @ApiProperty({
        description: "Array of room details",
        type: [RoomDetailsDto],
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => RoomDetailsDto)
    rooms: RoomDetailsDto[];

    @ApiProperty({
        description: "Guest details",
        type: GuestDetails,
    })
    @ValidateNested()
    @Type(() => GuestDetails)
    guest_details: GuestDetails;

    @ApiProperty({
        description: "Charge details",
        type: NewChargeDto,
    })
    @ValidateNested()
    @Type(() => NewChargeDto)
    charges: NewChargeDto;

    @ApiProperty({
        description: "Charge details",
        type: PaymentsDto,
    })
    @ValidateNested()
    @Type(() => PaymentsDto)
    payments: PaymentsDto;
}
