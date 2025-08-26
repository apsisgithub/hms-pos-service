import { ApiProperty } from "@nestjs/swagger";
import {
    IsNotEmpty,
    IsString,
    IsEmail,
    IsNumber,
    IsOptional,
    IsEnum,
    IsArray,
    MinLength,
} from "class-validator";
import {
    UserStatus,
    UserLanguage,
    CalendarLanguage,
} from "src/modules/master-users/entities/master_user.entity";

export class CreateMasterUserDto {
    @IsNotEmpty()
    @ApiProperty()
    @IsString()
    user_name: string;

    @IsNotEmpty()
    @ApiProperty()
    @IsString()
    @MinLength(8, { message: "Password must be at least 8 characters long" })
    password: string;

    @IsNotEmpty()
    @ApiProperty()
    @IsNumber()
    user_role_id: number;

    @IsNotEmpty()
    @ApiProperty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @ApiProperty()
    @IsString()
    mobile_no: string;

    @IsOptional()
    @ApiProperty()
    @IsEnum(UserLanguage)
    language: UserLanguage;

    @IsOptional()
    @ApiProperty()
    @IsEnum(CalendarLanguage)
    calendar_language: CalendarLanguage;

    @IsOptional()
    @ApiProperty()
    @IsNumber()
    show_last_credit_card_digits?: number;

    @IsOptional()
    @IsArray()
    @ApiProperty()
    @IsNumber({}, { each: true })
    privilege_ids?: number[];

    @IsOptional()
    @IsArray()
    @ApiProperty()
    @IsNumber({}, { each: true })
    discount_ids?: number[];

    @IsOptional()
    @IsArray()
    @ApiProperty()
    @IsNumber({}, { each: true })
    report_ids?: number[];

    @IsOptional()
    @IsString()
    @ApiProperty()
    name?: string;

    @IsOptional()
    @IsString()
    @ApiProperty()
    contact_no?: string;

    @IsOptional()
    @IsString()
    @ApiProperty()
    alternative_contact_no?: string;

    @IsOptional()
    @ApiProperty()
    @IsString()
    address?: string;

    @IsOptional()
    @ApiProperty()
    @IsString()
    nationality?: string;

    @IsOptional()
    @ApiProperty()
    @IsString()
    designation?: string;

    @IsOptional()
    @ApiProperty()
    @IsString()
    department?: string;

    @IsOptional()
    @ApiProperty()
    @IsString()
    identification_number?: string;

    @IsOptional()
    @ApiProperty()
    @IsString()
    identification_type?: string;

    @IsOptional()
    @ApiProperty()
    @IsString()
    bank_name?: string;

    @IsOptional()
    @ApiProperty()
    @IsString()
    branch_name?: string;

    @IsOptional()
    @ApiProperty()
    @IsString()
    salary_account_no?: string;

    @IsOptional()
    @ApiProperty()
    @IsString()
    mfs_no?: string;

    @IsOptional()
    @ApiProperty()
    @IsString()
    cv_attachment_url?: string;

    @IsOptional()
    @ApiProperty()
    @IsString()
    profile_picture_url?: string;

    @IsOptional()
    @ApiProperty()
    @IsEnum(UserStatus)
    status?: UserStatus;

    @IsOptional()
    @ApiProperty()
    @IsArray()
    permissions?: {
        permission_module_id: number;
        permission_actions_id: number[];
    }[];
}
