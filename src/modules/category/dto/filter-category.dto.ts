import {
  IsOptional,
  IsInt,
  IsString,
  Min,
  IsBoolean,
  IsNumber,
} from "class-validator";
import { Transform, Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CategoryFilterDto {
  @ApiPropertyOptional({
    description: "Page number (starts from 1)",
    example: 1,
    minimum: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({
    description: "Number of items per page",
    example: 10,
    minimum: 1,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit: number = 10;

  @ApiPropertyOptional({
    description: "Search by category name",
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: "Filter by parent category ID (for subcategories)",
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  parent_id?: number;

  @ApiPropertyOptional({
    description: "Include deleted waiters in the results",
    enum: ["yes", "no"],
    example: "no",
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value == "yes") return Boolean(true);
    if (value == "no") return Boolean(false);
    return value;
  })
  @IsBoolean()
  is_deleted?: boolean | string;

  @ApiProperty({
    description: "Identifier for the SBU in the SaaS application",
    example: 1,
  })
  @IsNumber()
  sbu_id: number;

  @ApiProperty({
    description: "Identifier for the OUtlet specific category",
    example: 1,
  })
  @IsNumber()
  outlet_id: number;
}
