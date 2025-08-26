import {
    IsNumber,
    IsString,
    IsOptional,
    IsNotEmpty,
    MaxLength,
    IsEnum,
} from "class-validator";
import { ApiProperty, PartialType, OmitType } from "@nestjs/swagger";
import { AgentStatus } from "../entities/master-business-agent.entity";

// The AgentStatus enum is directly taken from your entity to ensure type consistency.

export class CreateMasterBusinessAgentDto {
    @ApiProperty({
        description:
            "The ID of the SBU (Strategic Business Unit) this agent belongs to.",
        example: 1,
    })
    @IsNumber()
    @IsNotEmpty()
    sbu_id: number;

    @ApiProperty({
        description: "The full name of the business agent.",
        example: "John Doe Agency",
        maxLength: 255,
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    name: string;

    @ApiProperty({
        description: "A short code for the business agent (optional).",
        example: "JDA",
        required: false,
        maxLength: 50,
    })
    @IsOptional()
    @IsString()
    @MaxLength(50)
    short_code?: string;

    @ApiProperty({
        description: "A color associated with the agent (optional).",
        example: "#FF5733",
        required: false,
        maxLength: 20,
    })
    @IsOptional()
    @IsString()
    @MaxLength(20)
    color?: string;

    @ApiProperty({
        description: "Commission details for the agent (optional).",
        example: "10% on all bookings",
        required: false,
    })
    @IsOptional()
    @IsString()
    commission?: string;

    @ApiProperty({
        description: "The BIN number of the agent (optional).",
        example: "1234567890",
        required: false,
        maxLength: 50,
    })
    @IsOptional()
    @IsString()
    @MaxLength(50)
    bin_number?: string;

    @ApiProperty({
        description: "The address of the agent (optional).",
        example: "123 Main Street, Anytown, USA",
        required: false,
    })
    @IsOptional()
    @IsString()
    address?: string;

    @ApiProperty({
        description: "The status of the business agent.",
        enum: AgentStatus,
        default: AgentStatus.Active,
        required: false, // Optional for creation as it has a default value
    })
    @IsOptional()
    @IsEnum(AgentStatus)
    status?: AgentStatus;
}
