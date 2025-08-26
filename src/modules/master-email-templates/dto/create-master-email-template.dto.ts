import { ApiProperty, PartialType } from "@nestjs/swagger";
import {
    IsString,
    Length,
    IsNotEmpty,
    IsInt,
    IsOptional,
    IsEnum,
    IsEmail,
} from "class-validator";
import {
    EmailTemplateStatus,
    EmailTemplateType,
} from "../entities/master_email_templates.entity";
// Adjust path

export class CreateMasterEmailTemplateDto {
    @ApiProperty({
        description: "ID of the SBU this email template belongs to",
    })
    @IsInt()
    @IsNotEmpty()
    sbu_id: number;

    @ApiProperty({
        description: "Name of the template",
        required: false,
        maxLength: 255,
    })
    @IsOptional()
    @IsString()
    @Length(1, 255)
    name?: string;

    @ApiProperty({
        description: "Subject of the email",
        required: false,
        maxLength: 512,
    })
    @IsOptional()
    @IsString()
    @Length(1, 512)
    subject?: string;

    @ApiProperty({ description: "Body of the email template", required: false })
    @IsOptional()
    @IsString()
    body?: string;

    @ApiProperty({
        description: "Type of email template",
        enum: EmailTemplateType,
        required: false,
    })
    @IsOptional()
    @IsEnum(EmailTemplateType)
    template_type?: EmailTemplateType;

    @ApiProperty({
        description: "CC email addresses (comma-separated)",
        required: false,
        maxLength: 512,
    })
    @IsOptional()
    @IsString()
    @Length(1, 512)
    cc?: string;

    @ApiProperty({
        description: "BCC email addresses (comma-separated)",
        required: false,
        maxLength: 512,
    })
    @IsOptional()
    @IsString()
    @Length(1, 512)
    bcc?: string;

    @ApiProperty({
        description: "Status of the email template",
        enum: EmailTemplateStatus,
        default: EmailTemplateStatus.Active,
    })
    @IsEnum(EmailTemplateStatus)
    @IsNotEmpty()
    status: EmailTemplateStatus = EmailTemplateStatus.Active;
}
