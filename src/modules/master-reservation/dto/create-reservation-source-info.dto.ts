import {
    IsNumber,
    IsString,
    IsOptional,
    IsNotEmpty,
    MaxLength,
    IsEnum,
    IsDecimal,
} from "class-validator";
import { ApiProperty, PartialType } from "@nestjs/swagger";

export enum SourceInfoStatus {
    ACTIVE = "Active",
    INACTIVE = "Inactive",
}

export class CreateReservationSourceInfoDto {
    @ApiProperty({
        description: "The ID of the related reservation.",
        example: 1,
    })
    @IsNumber()
    @IsNotEmpty()
    reservation_id: number;

    @ApiProperty({
        description: "The ID of the market code (optional).",
        example: 101,
        required: false,
    })
    @IsOptional()
    @IsNumber()
    market_code_id?: number;

    @ApiProperty({
        description: "The ID of the business source (optional).",
        example: 1,
        required: false,
    })
    @IsOptional()
    @IsNumber()
    business_source_id?: number;

    @ApiProperty({
        description: "The ID of the travel agent (optional).",
        example: 5,
        required: false,
    })
    @IsOptional()
    @IsNumber()
    travel_agent_id?: number;

    @ApiProperty({
        description: "The voucher number for the reservation (optional).",
        example: "VOUCHER-001",
        required: false,
        maxLength: 255,
    })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    voucher_no?: string;

    @ApiProperty({
        description: "The commission plan for the reservation (optional).",
        example: "Confirm Booking",
        required: false,
        maxLength: 255,
    })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    commission_plan?: string;

    @ApiProperty({
        description: "The value of the plan (optional).",
        example: 150.75,
        required: false,
    })
    @IsOptional()
    @IsNumber()
    plan_value?: number;

    @ApiProperty({
        description: "The ID of the company (optional).",
        example: 2,
        required: false,
    })
    @IsOptional()
    @IsNumber()
    company_id?: number;

    @ApiProperty({
        description: "The ID of the sales person (optional).",
        example: 8,
        required: false,
    })
    @IsOptional()
    @IsNumber()
    sales_person_id?: number;

    @ApiProperty({
        description: "The status of the source info.",
        enum: SourceInfoStatus,
        default: SourceInfoStatus.ACTIVE,
    })
    @IsEnum(SourceInfoStatus)
    @IsNotEmpty()
    status: SourceInfoStatus;
}
