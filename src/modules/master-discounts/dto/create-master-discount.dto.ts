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
    IsObject,
} from "class-validator";
import { Type } from "class-transformer";
import {
    DiscountStatus,
    DiscountType,
} from "src/modules/master-discounts/entities/master_discount.entity";

export class CreateMasterDiscountDto {
    @ApiProperty({ description: "ID of the SBU this discount belongs to" })
    @IsInt()
    @IsNotEmpty()
    sbu_id: number;

    @ApiProperty({
        description: "Name of the discount (e.g., Early Bird Offer)",
    })
    @IsString()
    @IsNotEmpty()
    @Length(1, 255)
    name: string;

    @ApiProperty({
        description: "Code for the discount (e.g., EARLYBIRD20)",
        required: false,
        maxLength: 50,
    })
    @IsOptional()
    @IsString()
    @Length(1, 50)
    code?: string;

    @ApiProperty({
        description: "Type of discount (percentage or fixed)",
        enum: DiscountType,
        required: false,
    })
    @IsOptional()
    @IsEnum(DiscountType)
    type?: DiscountType;

    @ApiProperty({
        description: "Value of the discount",
        required: false,
        type: "number",
        format: "float",
    })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    value?: number;

    @ApiProperty({
        description: "Start date of the discount (YYYY-MM-DD)",
        required: false,
    })
    @IsOptional()
    @IsDateString()
    start_date?: string;

    @ApiProperty({
        description: "End date of the discount (YYYY-MM-DD)",
        required: false,
    })
    @IsOptional()
    @IsDateString()
    end_date?: string;

    @ApiProperty({
        description: "JSON array of items/services this discount applies to",
        required: false,
        type: Object,
    })
    @IsOptional()
    @IsObject()
    applies_to?: object;

    @ApiProperty({
        description: "Is this discount active?",
        required: false,
        default: true,
    })
    @IsOptional()
    @IsBoolean()
    is_active?: boolean = true;

    @ApiProperty({
        description: "Status of the discount",
        enum: DiscountStatus,
        default: DiscountStatus.Active,
    })
    @IsEnum(DiscountStatus)
    @IsNotEmpty()
    status: DiscountStatus = DiscountStatus.Active;
}
