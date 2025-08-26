import {
    IsString,
    IsOptional,
    IsBoolean,
    IsNumber,
    IsEnum,
    IsDate,
    IsNotEmpty,
    IsEmail,
    Length,
    Min,
    ValidateNested,
    ArrayMinSize,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
    GenderType,
    GuestType,
    IdVerificationType,
    PurposeOfVisit,
    VipStatus,
} from "../entities/master-guest.entity";

export class CreateSharerGuestDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    reservation_id: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    room_id: number;

    @ApiProperty({
        description: "Salutation (e.g., Mr., Ms., Dr.)",
        example: "Ms.",
    })
    @IsNotEmpty()
    @IsString()
    @Length(1, 50)
    salutation: string;

    @ApiProperty({
        description: "Full name of the guest",
        example: "Aniya Nusrat",
    })
    @IsNotEmpty({ message: "Guest name cannot be empty." })
    @IsString()
    @Length(1, 255)
    name: string;

    @ApiProperty({
        description: "Contact number of the guest",
        example: "+8801712345678",
    })
    @IsNotEmpty({ message: "Contact number cannot be empty." })
    @IsString()
    @Length(1, 50)
    contact_no: string;

    @ApiProperty({
        description: "ID of the associated Strategic Business Unit (SBU)",
        example: 101,
    })
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    sbu_id: number;

    // All other fields are optional

    @ApiProperty({
        description: "URL of the guest's image",
        required: false,
        example: "https://example.com/guest_profile/john_doe.jpg",
    })
    @IsOptional()
    @IsString()
    guest_image_url?: string;

    @ApiProperty({
        description: "Phone number of the guest",
        required: false,
        example: "+8801812345678",
    })
    @IsOptional()
    @IsString()
    @Length(1, 50)
    phone?: string;

    @ApiProperty({
        description: "Email address of the guest",
        example: "aniya.nusrat@example.com",
        required: false,
    })
    @IsOptional()
    @IsString()
    @IsEmail({}, { message: "Must be a valid email address." })
    @Length(1, 255)
    email?: string;

    @ApiProperty({
        description: "occupation of the guest",
        example: "Doctor",
        required: false,
    })
    @IsOptional()
    @IsString()
    @Length(1, 255)
    occupation?: string;

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
    @Length(1, 100)
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
    @Length(1, 100)
    id_issuing_country?: string;

    @ApiProperty({
        description: "City where the ID was issued",
        required: false,
        example: "Dhaka",
    })
    @IsOptional()
    @IsString()
    @Length(1, 100)
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
        required: false,
    })
    @IsOptional()
    @IsEnum(GenderType, { message: "Invalid gender type." })
    gender?: GenderType;

    @ApiProperty({
        description: "Nationality of the guest",
        required: false,
        example: "Bangladesh",
    })
    @IsOptional()
    @IsString()
    @Length(1, 100)
    nationality?: string;

    @ApiProperty({
        description: "Date of birth (YYYY-MM-DD)",
        required: false,
        example: "1990-05-15",
    })
    @IsOptional()
    @IsDate()
    date_of_birth?: Date;

    @ApiProperty({
        description: "Country of birth",
        required: false,
        example: "Bangladesh",
    })
    @IsOptional()
    @IsString()
    @Length(1, 100)
    birth_country?: string;

    @ApiProperty({
        description: "City of birth",
        required: false,
        example: "Dhaka",
    })
    @IsOptional()
    @IsString()
    @Length(1, 100)
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
    @Length(1, 100)
    country?: string;

    @ApiProperty({
        description: "Guest's city",
        required: false,
        example: "Dhaka",
    })
    @IsOptional()
    @IsString()
    @Length(1, 100)
    city?: string;

    @ApiProperty({
        description: "Guest's state",
        required: false,
        example: "Dhaka",
    })
    @IsOptional()
    @IsString()
    @Length(1, 100)
    state?: string;

    @ApiProperty({
        description: "Guest's postal code",
        required: false,
        example: "1212",
    })
    @IsOptional()
    @IsString()
    @Length(1, 20)
    postal_code?: string;

    @ApiProperty({
        description: "Guest's organization",
        required: false,
        example: "ABC Corp",
    })
    @IsOptional()
    @IsString()
    @Length(1, 255)
    organization?: string;

    @ApiProperty({
        description: "Guest's designation at work",
        required: false,
        example: "Software Engineer",
    })
    @IsOptional()
    @IsString()
    @Length(1, 255)
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
    @Length(1, 100)
    work_country?: string;

    @ApiProperty({
        description: "Work state",
        required: false,
        example: "Dhaka",
    })
    @IsOptional()
    @IsString()
    @Length(1, 100)
    work_state?: string;

    @ApiProperty({
        description: "Work city",
        required: false,
        example: "Dhaka",
    })
    @IsOptional()
    @IsString()
    @Length(1, 100)
    work_city?: string;

    @ApiProperty({
        description: "Work postal code",
        required: false,
        example: "1212",
    })
    @IsOptional()
    @IsString()
    @Length(1, 20)
    work_postal_code?: string;

    @ApiProperty({
        description: "Work phone 1",
        required: false,
        example: "+8801712345678",
    })
    @IsOptional()
    @IsString()
    @Length(1, 50)
    work_phone1?: string;

    @ApiProperty({
        description: "Work phone 2",
        required: false,
        example: "+8801812345678",
    })
    @IsOptional()
    @IsString()
    @Length(1, 50)
    work_phone2?: string;

    @ApiProperty({
        description: "Work fax",
        required: false,
        example: "+88029876543",
    })
    @IsOptional()
    @IsString()
    @Length(1, 50)
    work_fax?: string;

    @ApiProperty({
        description: "Work email",
        required: false,
        example: "aniya.nusrat@company.com",
    })
    @IsOptional()
    @IsString()
    @IsEmail({}, { message: "Must be a valid work email address." })
    @Length(1, 255)
    work_email?: string;

    @ApiProperty({
        description: "Work website",
        required: false,
        example: "https://www.company.com",
    })
    @IsOptional()
    @IsString()
    @Length(1, 255)
    work_website?: string;

    @ApiProperty({
        description: "Vehicle registration number",
        required: false,
        example: "ABC-123",
    })
    @IsOptional()
    @IsString()
    @Length(1, 100)
    vehicle_registration_no?: string;

    @ApiProperty({
        description: "License number",
        required: false,
        example: "L1234567",
    })
    @IsOptional()
    @IsString()
    @Length(1, 100)
    license_number?: string;

    @ApiProperty({
        description: "License issuing country",
        required: false,
        example: "Bangladesh",
    })
    @IsOptional()
    @IsString()
    @Length(1, 100)
    license_country?: string;

    @ApiProperty({
        description: "License issuing state",
        required: false,
        example: "Dhaka",
    })
    @IsOptional()
    @IsString()
    @Length(1, 100)
    license_state?: string;

    @ApiProperty({
        description: "Spouse's name",
        required: false,
        example: "Rahim Khan",
    })
    @IsOptional()
    @IsString()
    @Length(1, 255)
    spouse_name?: string;

    @ApiProperty({
        description: "Spouse's date of birth (YYYY-MM-DD)",
        required: false,
        example: "1992-08-20",
    })
    @IsOptional()
    @IsDate()
    spouse_dob?: Date;

    @ApiProperty({
        description: "Marriage anniversary date (YYYY-MM-DD)",
        required: false,
        example: "2015-11-25",
    })
    @IsOptional()
    @IsDate()
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
        description: "Name of the associated company",
        required: false,
        example: "ABC Corp",
    })
    @IsOptional()
    @IsString()
    @Length(1, 255)
    company_name?: string;
}

export class CreateMultipleSharerGuestsDto {
    @ApiProperty({
        type: [CreateSharerGuestDto],
        description: "Array of sharer guest objects",
        example: [
            {
                reservation_id: 100,
                room_id: 100,
                salutation: "Ms.",
                name: "Aniya ",
                contact_no: "+880170000678",
                sbu_id: 1,
            },
            {
                reservation_id: 3,
                room_id: 6,
                salutation: "Mr.",
                name: "John Doe",
                contact_no: "+880170000679",
                sbu_id: 1,
            },
        ],
    })
    @ValidateNested({ each: true })
    @Type(() => CreateSharerGuestDto)
    @ArrayMinSize(1, { message: "At least one guest must be provided." })
    guests: CreateSharerGuestDto[];
}
