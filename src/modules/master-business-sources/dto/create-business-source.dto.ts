import { ApiProperty, PartialType } from "@nestjs/swagger";
import {
    IsString,
    Length,
    IsNotEmpty,
    IsInt,
    IsOptional,
    IsEnum,
} from "class-validator";
import { BusinessSourceStatus } from "../entities/master_business_sources.entity";

export class CreateMasterBusinessSourceDto {
    @ApiProperty({
        description: "ID of the SBU this business source belongs to",
    })
    @IsInt()
    @IsNotEmpty()
    sbu_id: number;

    @ApiProperty({
        description: "Name of the business source (e.g., Expedia, Booking.com)",
        maxLength: 255,
    })
    @IsString()
    @IsNotEmpty()
    @Length(1, 255)
    name: string;

    @ApiProperty({
        description: "Code for the business source",
        required: false,
        maxLength: 50,
    })
    @IsOptional()
    @IsString()
    @Length(1, 50)
    short_code?: string;

    @ApiProperty({
        description: "Registration No. for the business source",
        required: false,
        maxLength: 50,
    })
    @IsOptional()
    @IsString()
    @Length(1, 50)
    registration_no?: string;

    @ApiProperty({
        description: "Address of the business source",
        required: false,
    })
    @IsOptional()
    @IsString()
    address?: string;

    @ApiProperty({
        description: "Market code for reference",
        required: false,
        maxLength: 20,
    })
    @IsOptional()
    @IsString()
    @Length(1, 20)
    market_code?: string;

    @ApiProperty({
        description: "Color tag for UI display (hex code)",
        required: false,
        maxLength: 10,
    })
    @IsOptional()
    @IsString()
    @Length(1, 10)
    color_code?: string;

    @ApiProperty({
        description: "Status of the business source",
        enum: BusinessSourceStatus,
        default: BusinessSourceStatus.Active,
    })
    @IsEnum(BusinessSourceStatus)
    @IsNotEmpty()
    status: BusinessSourceStatus = BusinessSourceStatus.Active;
}
