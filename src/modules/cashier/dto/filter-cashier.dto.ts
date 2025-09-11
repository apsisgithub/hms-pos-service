import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from "class-validator";

export class CashierFilterDto {
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
    example: "John",
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

  @ApiProperty({
    description: "Filter by Outlet ID",
    example: 101,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @IsInt()
  outlet_id?: number;

  @ApiPropertyOptional({ enum: ["Yes", "No"] })
  @IsOptional()
  is_deleted?: "Yes" | "No";
}
