import { ApiProperty, PartialType } from "@nestjs/swagger";
import {
    IsString,
    Length,
    IsNotEmpty,
    IsInt,
    IsOptional,
    IsBoolean,
    IsEnum,
    IsObject,
} from "class-validator";
import {
    PaymentModeStatus,
    PaymentModeType,
} from "src/modules/master-payment-modes/entities/master_payment_modes.entity";
// Adjust path

export class CreateMasterPaymentModeDto {
   
    @ApiProperty({
        description: "Name of the payment mode (e.g., Credit Card, Cash)",
        maxLength: 255,
    })
    @IsString()
    @IsNotEmpty()
    @Length(1, 255)
    name: string;

   
    @ApiProperty({
        description: "Status of the payment mode",
        enum: PaymentModeStatus,
        default: PaymentModeStatus.Active,
    })
    @IsEnum(PaymentModeStatus)
    @IsNotEmpty()
    status: PaymentModeStatus = PaymentModeStatus.Active;
}
