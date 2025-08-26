import {
    IsString,
    IsOptional,
    IsBoolean,
    IsNumber,
    IsEmail,
    IsUrl,
    IsEnum,
    IsArray,
    ValidateIf,
    IsNotEmpty,
} from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger"; // Import ApiProperty
import { MasterSbuStatus } from "../entities/master_sbu.entity"; // Import the enum from your entity

export class CreateMasterSbuDto {
    @ApiProperty({
        description:
            "The unique name of the Strategic Business Unit (e.g., Hotel Name)",
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        description: "The physical address of the SBU",

        required: false,
    })
    @IsOptional()
    @IsString()
    address?: string;

    @ApiProperty({
        description: "The contact email address for the SBU",

        required: false,
    })
    @IsOptional()
    @IsEmail()
    email?: string;

    @ApiProperty({
        description: "The contact phone number for the SBU",

        required: false,
    })
    @IsOptional()
    @IsString()
    phone?: string;

    @ApiProperty({
        description: "The official website URL of the SBU",

        required: false,
    })
    @IsOptional()
    @IsUrl()
    website?: string;

    @ApiProperty({
        description: "The URL of the SBU logo",

        required: false,
    })
    @IsOptional()
    @IsUrl()
    logo_url?: string;

    @ApiProperty({
        description: 'The dimensions of the SBU logo (e.g., "200x200")',
        required: false,
    })
    @IsOptional()
    @IsString()
    logo_dimension?: string;

    @ApiProperty({
        description: "The country where the SBU is locating",

        required: false,
    })
    @IsOptional()
    @IsString()
    country?: string;

    @ApiProperty({
        description: "The city where the SBU is located",

        required: false,
    })
    @IsOptional()
    @IsString()
    city?: string;

    @ApiProperty({
        description: 'The star grade or rating of the hotel (e.g., "5-star")',

        required: false,
    })
    @IsOptional()
    @IsString()
    grade?: string;

    @ApiProperty({
        description: "The Business Identification Number (BIN) of the SBU",

        required: false,
    })
    @IsOptional()
    @IsString()
    bin_number?: string;

    @ApiProperty({
        description:
            'The default currency code for the SBU (e.g., "USD", "BDT")',

        required: false,
    })
    @IsOptional()
    @IsString()
    currency_code?: string;

    @ApiProperty({
        description: 'The timezone of the SBU (e.g., "Asia/Dhaka")',

        required: false,
    })
    @IsOptional()
    @IsString()
    timezone?: string;

    @ApiProperty({
        description: "List of POS outlets associated with the SBU",

        type: [String],
        required: false,
    })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    @ValidateIf((o) => o.pos_outlets !== undefined && o.pos_outlets !== null)
    pos_outlets?: string[];

    @ApiProperty({
        description: "Total number of rooms available in the SBU",

        required: false,
    })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    total_rooms_count?: number;

    @ApiProperty({
        description:
            'Assigned IP address(es) for the SBU (e.g., "192.168.1.1, 192.168.1.2")',

        required: false,
    })
    @IsOptional()
    @IsString()
    assigned_ip?: string;

    @ApiProperty({
        description: "Name of the VAT software used by the SBU",

        required: false,
    })
    @IsOptional()
    @IsString()
    vat_software?: string;

    @ApiProperty({
        description: 'The tax rule applied to the SBU (e.g., "Standard VAT")',

        required: false,
    })
    @IsOptional()
    @IsString()
    tax_rule?: string;

    @ApiProperty({
        description: "Hotline number for the SBU",

        required: false,
    })
    @IsOptional()
    @IsString()
    hot_line?: string;

    @ApiProperty({
        description: "Fax number for the SBU",

        required: false,
    })
    @IsOptional()
    @IsString()
    fax?: string;

    @ApiProperty({
        description: "General policy description for the hotel",

        required: false,
    })
    @IsOptional()
    @IsString()
    hotel_policy_description?: string;

    @ApiProperty({
        description: "Number of buildings in the SBU property",

        required: false,
    })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    number_of_buildings?: number;

    @ApiProperty({
        description: "Number of restaurant outlets within the SBU",

        required: false,
    })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    number_of_restaurant_outlets?: number;

    @ApiProperty({
        description: "Indicates if laundry service is handled by Front Office",

        required: false,
    })
    @IsOptional()
    @IsBoolean()
    is_laundry_from_fo?: boolean;

    @ApiProperty({
        description: "Indicates if minibar service is handled by Front Office",

        required: false,
    })
    @IsOptional()
    @IsBoolean()
    is_minibar_from_fo?: boolean;

    @ApiProperty({
        description: "Indicates if the SBU is active",

        required: false,
    })
    @IsOptional()
    @IsBoolean()
    is_active?: boolean;

    @ApiProperty({
        description: "The operational status of the SBU",
        enum: MasterSbuStatus,
        example: MasterSbuStatus.Active,
        required: false,
    })
    @IsOptional()
    @IsEnum(MasterSbuStatus)
    status?: MasterSbuStatus;
}
