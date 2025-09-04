import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsOptional,
  IsBoolean,
  IsString,
  IsNumber,
  IsInt,
  Min,
} from "class-validator";

export class FilterProductDto {
  @ApiProperty({
    description: "Page number for pagination",
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @IsInt()
  @Min(1)
  page?: number;

  @ApiProperty({
    description: "Number of records per page",
    example: 10,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @IsInt()
  @Min(1)
  limit?: number;

  @ApiProperty({
    description: "Search term for waiter name or employee code",
    example: "product name",
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ description: "Filter by SBU ID", example: 1, required: false })
  @IsOptional()
  @IsNumber()
  @IsInt()
  sbu_id?: number;

  @ApiPropertyOptional({
    description: "Filter by Outlet ID",
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @IsInt()
  outlet_id?: number;

  @ApiPropertyOptional({
    description: "Filter by Category ID",
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @IsInt()
  category_id?: number;

  @ApiPropertyOptional({ enum: ["Yes", "No"] })
  @IsOptional()
  is_deleted?: "Yes" | "No";

  @ApiPropertyOptional({ enum: ["Yes", "No"] })
  @IsOptional()
  is_special?: "Yes" | "No";

  @ApiPropertyOptional({ enum: ["Yes", "No"] })
  @IsOptional()
  offer_is_available?: "Yes" | "No";
}
