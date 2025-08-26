// src/modules/master-seasons/dto/create-season.dto.ts

import {
    IsNotEmpty,
    IsString,
    IsNumber,
    IsDateString,
    IsOptional,
    IsEnum,
    Length,
    Min,
    Max,
    IsArray,
    ArrayMinSize,
} from "class-validator";

import { SeasonStatus } from "../entities/master_seasons.entity"; // Adjust path based on your project structure
import { ApiProperty } from "@nestjs/swagger";

export class CreateSeasonDto {
    @IsNotEmpty()
    @ApiProperty()
    @IsNumber()
    // The sbu_id refers to the ID of the MasterSbu it belongs to.
    sbu_id: number;

    @IsNotEmpty()
    @ApiProperty()
    @IsString()
    @Length(1, 50, {
        message: "Short code must be between 1 and 50 characters.",
    })
    // Corresponds to 'Short Code' (Text) from SRS
    short_code: string;

    @IsNotEmpty()
    @ApiProperty()
    @IsString()
    @Length(1, 255, {
        message: "Season name must be between 1 and 255 characters.",
    })
    // Corresponds to 'Season Name' (Text) from SRS
    season_name: string;

    @IsNotEmpty()
    @ApiProperty()
    @IsNumber({}, { message: "From Day must be a number." })
    @Min(1, { message: "From Day must be at least 1." })
    @Max(31, { message: "From Day must be at most 31." })
    // Corresponds to 'From Day' (Dropdown) from SRS
    from_day: number;

    @IsNotEmpty()
    @ApiProperty()
    @IsNumber({}, { message: "To Day must be a number." })
    @Min(1, { message: "To Day must be at least 1." })
    @Max(31, { message: "To Day must be at most 31." })
    // Corresponds to 'To Day' (Dropdown) from SRS
    to_day: number;

    @IsNotEmpty()
    @ApiProperty()
    @IsNumber({}, { message: "From Month must be a number." })
    @Min(1, { message: "From Month must be at least 1 (January)." })
    @Max(12, { message: "From Month must be at most 12 (December)." })
    // Corresponds to 'From Month' (Dropdown) from SRS (using number 1-12)
    from_month: number;

    @IsNotEmpty()
    @ApiProperty()
    @IsNumber({}, { message: "To Month must be a number." })
    @Min(1, { message: "To Month must be at least 1 (January)." })
    @Max(12, { message: "To Month must be at most 12 (December)." })
    // Corresponds to 'To Month' (Dropdown) from SRS (using number 1-12)
    to_month: number;

    @IsNotEmpty()
    @ApiProperty()
    @IsDateString(
        { strict: true },
        { message: "Expiration date must be a valid date string (YYYY-MM-DD)." }
    )
    // Corresponds to 'Expiration date' (date) from SRS
    expiration_date: string; // Expected as 'YYYY-MM-DD' string

    @ApiProperty({
        description: "List of Room Type IDs. Multiple IDs can be sent.",
        type: "array", // Indicates that this property is an array
        items: {
            type: "number", // Specifies the type of elements within the array
            format: "int32", // Optional: Provides a hint for integer format in Swagger UI
        },
        required: true,
        example: [1, 5, 8], // Provide a clear example for documentation
    })
    @IsArray({ message: "Room type IDs must be provided as an array." }) // Validates that the value is an array
    @IsOptional({ message: "The array of room type IDs cannot be empty." }) // Ensures the array itself is not empty (if required)
    @ArrayMinSize(1, { message: "At least one room type ID must be provided." }) // Ensures there's at least one ID in the array
    @IsNumber(
        {},
        { each: true, message: "Each room type ID must be a number." }
    ) // IMPORTANT: Validates *each element* in the array as a number
    room_type_ids: number[];

    @IsOptional()
    @ApiProperty()
    @IsEnum(SeasonStatus, {
        message:
            "Status must be a valid SeasonStatus enum value (Active or Inactive).",
    })
    status?: SeasonStatus;
}
