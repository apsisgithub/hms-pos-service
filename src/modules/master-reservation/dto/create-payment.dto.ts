import {
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    IsEnum,
    IsDateString,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { PaymentStatusTypes } from "../entities/master_payments.entity";

export class CreatePaymentDto {
    @ApiProperty({
        description: "ID of the SBU (Strategic Business Unit)",
        example: 1,
    })
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    sbu_id: number;

    @ApiProperty({
        description: "ID of the reservation",
        example: 1,
    })
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    reservation_id: number;

    @ApiProperty({
        description: "ID of the currency",
        required: false,
        example: 1,
    })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    currency_id?: number;

    @ApiProperty({
        description: "ID of the credit card",
        required: false,
        example: 1,
    })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    credit_card_id?: number;

    @ApiProperty({
        description: "ID of the payment mode",
        example: 1,
    })
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    payment_mode_id: number;

    @ApiProperty({
        description: "Amount paid",
        example: 150.75,
    })
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    paid_amount: number;

    @ApiProperty({
        description: "Date of payment",
        example: "2024-01-15",
        required: false,
    })
    @IsOptional()
    @IsDateString()
    paid_date?: string;

    @ApiProperty({
        description: "Payment status",
        enum: PaymentStatusTypes,
        example: PaymentStatusTypes.Paid,
    })
    @IsNotEmpty()
    @IsEnum(PaymentStatusTypes)
    payment_status: PaymentStatusTypes;

    @ApiProperty({
        description: "Description of the payment",
        example: "Payment for room charges",
    })
    @IsNotEmpty()
    @IsString()
    description: string;

    @ApiProperty({
        description: "ID of the folio",
        required: false,
        example: 1,
    })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    folio_id?: number;
}
