import { IsOptional, IsInt, IsString, Min } from "class-validator";
import { Type } from "class-transformer";
import { ApiPropertyOptional } from "@nestjs/swagger";

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
    example: "Electronics",
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: "Filter by parent category ID (for subcategories)",
    example: 5,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  parentId?: number;
}
