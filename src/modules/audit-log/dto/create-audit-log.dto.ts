import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class CreateAuditLogDto {
    @ApiProperty({
        description: "ID of the reservation",
        example: 1,
    })
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    reservation_id: number;

    @ApiProperty({
        description: "ID of the SBU (Strategic Business Unit)",
        example: 1,
    })
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    sbu_id: number;

    @ApiProperty({
        description: "Previous title/action before the operation",
        example: "Folio Balance",
        required: false,
    })
    @IsOptional()
    @IsString()
    prev_title?: string;

    @ApiProperty({
        description: "Previous description/details before the operation",
        example: "Balance was $250.00",
        required: false,
    })
    @IsOptional()
    @IsString()
    prev_description?: string;

    @ApiProperty({
        description: "Title/action after the operation",
        example: "Payment Applied",
    })
    @IsNotEmpty()
    @IsString()
    after_title: string;

    @ApiProperty({
        description: "Description/details after the operation",
        example: "Payment of $100.00 applied, new balance: $150.00",
        required: false,
    })
    @IsOptional()
    @IsString()
    after_description?: string;

    @ApiProperty({
        description: "IP address of the user performing the operation",
        example: "192.168.1.100",
        required: false,
    })
    @IsOptional()
    @IsString()
    ip_address?: string;

    @ApiProperty({
        description: "Type of operation performed",
        example: "PAYMENT_APPLIED",
        required: false,
    })
    @IsOptional()
    @IsString()
    operation_type?: string;
}