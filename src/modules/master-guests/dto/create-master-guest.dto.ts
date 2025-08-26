// src/modules/master-guests/dto/create-master-guest.dto.ts

import {
    IsString,
    IsOptional,
    IsBoolean,
    IsNumber,
    IsEnum,
    IsDateString,
    IsNotEmpty,
    IsEmail,
    Length,
    Min,
    Max,
    IsDate,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
    GenderType,
    GuestType,
    IdVerificationType,
    PreferencesType,
    PurposeOfVisit,
    VipStatus,
} from "../entities/master-guest.entity"; // Adjust path based on your project structure

export class CreateMasterGuestDto {
    @ApiProperty({
        description: "URL of the guest's image",
        required: false,
        example: "https://example.com/guest_profile/john_doe.jpg",
    })
    @IsOptional()
    @IsString()
    guest_image_url?: string;

    @ApiProperty({
        description: "Salutation (e.g., Mr., Ms., Dr.)",
        required: false,
        example: "Ms.",
    })
    @IsOptional()
    @IsString()
    salutation?: string;

    @ApiProperty({
        description: "Full name of the guest",
        example: "Aniya Nusrat",
    })
    @IsNotEmpty({ message: "Guest name cannot be empty." })
    @IsString()
    name: string;

    @ApiProperty({
        description: "Contact number of the guest",
        example: "+8801712345678",
    })
    @IsNotEmpty({ message: "Contact number cannot be empty." })
    @IsString()
    contact_no: string;

    @ApiProperty({
        description: "Phone number of the guest",
        required: false,
        example: "+8801812345678",
    })
    @IsOptional()
    @IsString()
    phone: string;

    @ApiProperty({
        description: "Email address of the guest",
        example: "aniya.nusrat@example.com",
    })
    @IsOptional({ message: "Email cannot be empty." })
    email: string;

    @ApiProperty({
        description: "occupation of the guest",
        example: "Doctor",
    })
    @IsOptional({ message: "occupation cannot be empty." })
    @IsString()
    occupation: string;

    @ApiProperty({
        description: "Status of Guest Membership",
        required: false,
        enum: VipStatus,
        example: VipStatus.BRONZE,
    })
    @IsOptional()
    @IsEnum(VipStatus, { message: "Invalid vip type." })
    vip_status?: VipStatus;

    @ApiProperty({
        description: "Type of ID verification document",
        required: false,
        enum: IdVerificationType,
        example: IdVerificationType.NID,
    })
    @IsOptional()
    @IsEnum(IdVerificationType, { message: "Invalid ID verification type." })
    id_type?: IdVerificationType;

    @ApiProperty({
        description: "URL of the ID image",
        required: false,
        example: "https://example.com/id_images/nid_123.jpg",
    })
    @IsOptional()
    @IsString()
    id_image_url?: string;

    @ApiProperty({
        description: "ID document number",
        required: false,
        example: "1234567890123",
    })
    @IsOptional()
    @IsString()
    id_number?: string;

    @ApiProperty({
        description: "ID document expiry date (YYYY-MM-DD)",
        required: false,
        example: "2030-12-31",
    })
    @IsOptional()
    @IsDate()
    id_expiry_date?: Date;

    @ApiProperty({
        description: "Country where the ID was issued",
        required: false,
        example: "Bangladesh",
    })
    @IsOptional()
    @IsString()
    id_issuing_country?: string;

    @ApiProperty({
        description: "City where the ID was issued",
        required: false,
        example: "Dhaka",
    })
    @IsOptional()
    @IsString()
    id_issuing_city?: string;

    @ApiProperty({
        description: "Type of guest (Adult, Child, Infant)",
        required: false,
        enum: GuestType,
        example: GuestType.ADULT,
    })
    @IsOptional()
    @IsEnum(GuestType, { message: "Invalid guest type." })
    guest_type?: GuestType;

    @ApiProperty({
        description: "Gender of the guest",
        enum: GenderType,
        default: GenderType.MALE,
    })
    @IsEnum(GenderType, { message: "Invalid gender type." })
    @IsOptional()
    gender: GenderType;

    @ApiProperty({
        description: "Nationality of the guest",
        required: false,
        example: "Bangladesh",
    })
    @IsOptional()
    @IsString()
    nationality?: string;

    @ApiProperty({
        description: "Date of birth (YYYY-MM-DD)",
        required: false,
        example: "1990-05-15",
    })
    @IsOptional()
    @IsDate()
    date_of_birth?: Date; // Entity uses string, so DTO matches

    @ApiProperty({
        description: "Country of birth",
        required: false,
        example: "Bangladesh",
    })
    @IsOptional()
    @IsString()
    birth_country?: string;

    @ApiProperty({
        description: "City of birth",
        required: false,
        example: "Dhaka",
    })
    @IsOptional()
    @IsString()
    birth_city?: string;

    @ApiProperty({
        description: "Purpose of the visit",
        required: false,
        example: PurposeOfVisit.BUSINESS_AND_MICE,
        enum: PurposeOfVisit,
    })
    @IsOptional()
    @IsEnum(PurposeOfVisit)
    purpose_of_visit?: PurposeOfVisit;

    @ApiProperty({
        description: "Guest's address",
        required: false,
        example: "House 10, Road 5, Gulshan, Dhaka",
    })
    @IsOptional()
    @IsString()
    address?: string;

    @ApiProperty({
        description: "Guest's country",
        required: false,
        example: "Bangladesh",
    })
    @IsOptional()
    @IsString()
    country?: string;

    @ApiProperty({
        description: "Guest's city",
        required: false,
        example: "Dhaka",
    })
    @IsOptional()
    @IsString()
    city?: string;

    @ApiProperty({
        description: "Guest's state",
        required: false,
        example: "Dhaka",
    })
    @IsOptional()
    @IsString()
    state?: string;

    @ApiProperty({
        description: "Guest's postal code",
        required: false,
        example: "1212",
    })
    @IsOptional()
    @IsString()
    postal_code?: string;

    @ApiProperty({
        description: "Guest's organization",
        required: false,
        example: "ABC Corp",
    })
    @IsOptional()
    @IsString()
    organization?: string;

    @ApiProperty({
        description: "Guest's designation at work",
        required: false,
        example: "Software Engineer",
    })
    @IsOptional()
    @IsString()
    designation?: string;

    @ApiProperty({
        description: "Work address",
        required: false,
    })
    @IsOptional()
    @IsString()
    work_address?: string;

    @ApiProperty({
        description: "Work country",
        required: false,
        example: "Bangladesh",
    })
    @IsOptional()
    @IsString()
    work_country?: string;

    @ApiProperty({
        description: "Work state",
        required: false,
        example: "Dhaka",
    })
    @IsOptional()
    @IsString()
    work_state?: string;

    @ApiProperty({
        description: "Work city",
        required: false,
        example: "Dhaka",
    })
    @IsOptional()
    @IsString()
    work_city?: string;

    @ApiProperty({
        description: "Work postal code",
        required: false,
        example: "1212",
    })
    @IsOptional()
    @IsString()
    work_postal_code?: string;

    @ApiProperty({
        description: "Work phone 1",
        required: false,
        example: "+8801712345678",
    })
    @IsOptional()
    @IsString()
    work_phone1?: string;

    @ApiProperty({
        description: "Work phone 2",
        required: false,
        example: "+8801812345678",
    })
    @IsOptional()
    @IsString()
    work_phone2?: string;

    @ApiProperty({
        description: "Work fax",
        required: false,
        example: "+88029876543",
    })
    @IsOptional()
    @IsString()
    work_fax?: string;

    @ApiProperty({
        description: "Work email",
        required: false,
        example: "aniya.nusrat@company.com",
    })
    @IsOptional()
    @IsString()
    work_email?: string;

    @ApiProperty({
        description: "Work website",
        required: false,
        example: "https://www.company.com",
    })
    @IsOptional()
    @IsString()
    work_website?: string;

    @ApiProperty({
        description: "Vehicle registration number",
        required: false,
        example: "ABC-123",
    })
    @IsOptional()
    @IsString()
    vehicle_registration_no?: string;

    @ApiProperty({
        description: "License number",
        required: false,
        example: "L1234567",
    })
    @IsOptional()
    @IsString()
    license_number?: string;

    @ApiProperty({
        description: "License issuing country",
        required: false,
        example: "Bangladesh",
    })
    @IsOptional()
    @IsString()
    license_country?: string;

    @ApiProperty({
        description: "License issuing state",
        required: false,
        example: "Dhaka",
    })
    @IsOptional()
    @IsString()
    license_state?: string;

    @ApiProperty({
        description: "Spouse's name",
        required: false,
        example: "Rahim Khan",
    })
    @IsOptional()
    @IsString()
    spouse_name?: string;

    @ApiProperty({
        description: "Spouse's date of birth (YYYY-MM-DD)",
        required: false,
        example: "1992-08-20",
    })
    @IsOptional()
    spouse_dob?: Date;

    @ApiProperty({
        description: "Marriage anniversary date (YYYY-MM-DD)",
        required: false,
        example: "2015-11-25",
    })
    @IsOptional()
    marriage_anniversary?: Date;

    @ApiProperty({
        description: "Personal preferences of the guest",
        required: false,
        example: "Non-smoking room, high floor",
    })
    @IsOptional()
    @IsString()
    personal_preferences?: string;

    @ApiProperty({
        description:
            "Personal preferences of the guest like F&B,  Front Office",
        required: false,
        example: "Non-smoking room, high floor",
    })
    @IsOptional()
    @IsEnum(PreferencesType)
    personal_preferences_type?: PreferencesType;

    @ApiProperty({
        description: "Indicates if the guest is a member",
        required: false,
        example: true,
    })
    @IsOptional()
    @IsBoolean()
    @Type(() => Boolean)
    is_member?: boolean;

    @ApiProperty({
        description: "Total loyalty points earned by the guest",
        required: false,
        type: "number",
        format: "float",
        example: 1500.5,
    })
    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    @Type(() => Number)
    total_points_earned?: number;

    @ApiProperty({
        description: "Total loyalty points redeemed by the guest",
        required: false,
        type: "number",
        format: "float",
        example: 500.0,
    })
    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    @Type(() => Number)
    redeemed_points?: number;

    @ApiProperty({
        description: "Remaining loyalty points of the guest",
        required: false,
        type: "number",
        format: "float",
        example: 1000.5,
    })
    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    @Type(() => Number)
    remaining_points?: number;

    @ApiProperty({
        description: "ID of the associated company (if applicable)",
        required: false,
        example: 1,
    })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    company_id?: number;

    @ApiProperty({
        description: "ID of the associated Strategic Business Unit (SBU)",
        required: false,
        example: 101,
    })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    sbu_id?: number;

    @ApiProperty({
        description: "Name of the associated company",
        required: false,
        example: "ABC Corp",
    })
    @IsOptional()
    @IsString()
    company_name?: string;
}
