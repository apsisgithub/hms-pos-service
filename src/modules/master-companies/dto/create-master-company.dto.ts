import {
    IsString,
    IsOptional,
    IsNotEmpty,
    MaxLength,
    IsNumber,
    IsBoolean,
    IsDateString,
    IsEmail,
    IsUrl,
    IsEnum,
    IsDate,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { CompanyStatus } from "../entities/master-companies.entity";

export class CreateMasterCompanyDto {
    @ApiProperty({
        description: "The official registered name of the company.",
        example: "Global Solutions Ltd.",
        maxLength: 255,
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    register_name: string;

    @ApiProperty({
        description:
            "The ID of the Strategic Business Unit (SBU) this company belongs to.",
        example: 1,
    })
    @IsNumber()
    @IsNotEmpty()
    sbu_id: number;

    @ApiProperty({
        description: "A common or known name for the company (optional).",
        example: "Global Sol.",
        required: false,
        maxLength: 255,
    })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    company_known_as?: string;

    @ApiProperty({
        description: "The company's full address (optional).",
        example: "123 Main Street, Suite 400, City, Country",
        required: false,
    })
    @IsOptional()
    @IsString()
    company_address?: string;

    @ApiProperty({
        description: "The company's primary phone number (optional).",
        example: "+1-555-123-4567",
        required: false,
        maxLength: 50,
    })
    @IsOptional()
    @IsString()
    @MaxLength(50)
    company_phone_number?: string;

    @ApiProperty({
        description: "The company's fax number (optional).",
        example: "+1-555-987-6543",
        required: false,
        maxLength: 50,
    })
    @IsOptional()
    @IsString()
    @MaxLength(50)
    fax?: string;

    @ApiProperty({
        description: "The company's email address (optional).",
        example: "contact@globalsol.com",
        required: false,
        maxLength: 255,
    })
    @IsOptional()
    @IsString()
    @IsEmail()
    @MaxLength(255)
    email?: string;

    @ApiProperty({
        description: "The company's website URL (optional).",
        example: "https://www.globalsol.com",
        required: false,
        maxLength: 255,
    })
    @IsOptional()
    @IsString()
    @IsUrl()
    @MaxLength(255)
    website?: string;

    @ApiProperty({
        description: "A unique internal code for the company (optional).",
        example: "GS-001",
        required: false,
        maxLength: 100,
    })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    company_code?: string;

    @ApiProperty({
        description: "The name of the main contact person (optional).",
        example: "Jane Doe",
        required: false,
    })
    @IsOptional()
    @IsString()
    contact_person?: string;

    @ApiProperty({
        description: "The validity period for credit in days (optional).",
        example: 30,
        required: false,
    })
    @IsOptional()
    @IsNumber()
    credit_validity?: number;

    @ApiProperty({
        description: "The current outstanding credit amount (optional).",
        example: 500.5,
        required: false,
    })
    @IsOptional()
    @IsNumber()
    current_outstanding?: number;

    @ApiProperty({
        description:
            "The action to take when the credit limit is exceeded (optional).",
        example: "Block Further Orders",
        required: false,
        maxLength: 100,
    })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    over_limit_action?: string;

    @ApiProperty({
        description: "The date of the last payment made (optional).",
        example: "2024-01-15",
        required: false,
    })
    @IsOptional()
    @IsDate()
    last_payment_date?: Date;

    @ApiProperty({
        description: "Indicates if the company ledger is applied (optional).",
        example: true,
        required: false,
    })
    @IsOptional()
    @IsBoolean()
    is_ledger_applied?: boolean;

    @ApiProperty({
        description: "The credit limit for the company (optional).",
        example: 1000.0,
        required: false,
    })
    @IsOptional()
    @IsNumber()
    credit_limit?: number;

    @ApiProperty({
        description: "The payment terms (e.g., 'Net 30', 'EOM') (optional).",
        example: "Net 30",
        required: false,
        maxLength: 100,
    })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    payment_term?: string;

    @ApiProperty({
        description: "The status of the business agent.",
        enum: CompanyStatus,
        default: CompanyStatus.ACTIVE,
        required: false,
    })
    @IsOptional()
    @IsEnum(CompanyStatus)
    status?: CompanyStatus;

    @ApiProperty({
        description:
            "Indicates if authorization is required for orders (optional).",
        example: false,
        required: false,
    })
    @IsOptional()
    @IsBoolean()
    authorization_required?: boolean;

    @ApiProperty({
        description:
            "The name of the approver if authorization is required (optional).",
        example: "Jane Smith",
        required: false,
        maxLength: 255,
    })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    approver_name?: string;

    @ApiProperty({
        description: "Indicates if special offers are applied (optional).",
        example: true,
        required: false,
    })
    @IsOptional()
    @IsBoolean()
    is_offer_applied?: boolean;

    @ApiProperty({
        description:
            "A description of services provided to the company (optional).",
        example: "Website hosting, domain registration, and support.",
        required: false,
    })
    @IsOptional()
    @IsString()
    services?: string;

    @ApiProperty({
        description:
            "The discount percentage applied to the company (optional).",
        example: 5.5,
        required: false,
    })
    @IsOptional()
    @IsNumber()
    discount_percentage?: number;
}
