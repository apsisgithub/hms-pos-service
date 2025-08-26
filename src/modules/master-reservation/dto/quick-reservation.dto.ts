import {
    IsString,
    IsOptional,
    IsNumber,
    IsDateString,
    IsArray,
    ValidateNested,
    IsEmail,
    IsBoolean,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class GuestDetailsDto {
    @ApiProperty({
        description: "ID of existing guest (optional)",
        required: false,
        example: 1,
    })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    guest_id?: number;

    @ApiProperty({
        description: "Guest name",
        example: "John Doe",
    })
    @IsString()
    name: string;

    @ApiProperty({
        description: "Guest email",
        example: "john.doe@example.com",
    })
    @IsEmail()
    @IsOptional()
    email?: string;

    @ApiProperty({
        description: "Guest mobile number",
        example: "+1234567890",
    })
    @IsString()
    @IsOptional()
    mobile_no?: string;

    @ApiProperty({
        description: "Company name",
        example: "ABC Corporation",
    })
    @IsString()
    @IsOptional()
    company_name?: string;
}

export class RoomDetailsDto {
    @ApiProperty({
        description: "ID of the room",
        example: 1,
    })
    @IsNumber()
    @Type(() => Number)
    room_id: number;

    @ApiProperty({
        description: "ID of the rate type",
        example: 1,
    })
    @IsNumber()
    @Type(() => Number)
    rate_type_id: number;

    @ApiProperty({
        description: "ID of the room type id",
        example: 1,
    })
    @IsNumber()
    @Type(() => Number)
    room_type_id: number;

    @ApiProperty({
        description: "Room rate",
        example: 150.0,
    })
    @IsNumber({ maxDecimalPlaces: 2 })
    @Type(() => Number)
    rate: number;

    @ApiProperty({
        description: "Number of adults",
        example: 2,
    })
    @IsNumber()
    @Type(() => Number)
    adult_count: number;

    @ApiProperty({
        description: "Number of children",
        example: 1,
    })
    @IsNumber()
    @Type(() => Number)
    child_count: number;

    @ApiProperty({
        description: "is_assigned",
        example: 1,
    })
    @IsBoolean()
    @Type(() => Boolean)
    is_assigned: boolean;
}

export class QuickReservationDto {
    @ApiProperty({
        description: "SBU ID",
        example: 1,
    })
    @IsNumber()
    @Type(() => Number)
    sbu_id: number;

    @ApiProperty({
        description: "Check-in date (ISO 8601 format)",
        example: "2025-08-10",
    })
    @IsDateString()
    checkin_date: string;

    @ApiProperty({
        description: "Check-out date (ISO 8601 format)",
        example: "2025-08-15",
    })
    @IsDateString()
    checkout_date: string;

    @ApiProperty({
        description: "ID of payment mode",
        example: 1,
    })
    @IsNumber()
    @Type(() => Number)
    payment_mode_id: number;

    @ApiProperty({
        description: "ID of business source",
        example: 1,
    })
    @IsNumber()
    @Type(() => Number)
    business_source_id: number;

    @ApiProperty({
        description: "Guest details",
        type: GuestDetailsDto,
    })
    @ValidateNested()
    @Type(() => GuestDetailsDto)
    guest_details: GuestDetailsDto;

    @ApiProperty({
        description: "Array of room details",
        type: [RoomDetailsDto],
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => RoomDetailsDto)
    rooms: RoomDetailsDto[];
}
