import { IsOptional, IsInt, IsString, Min } from "class-validator";
import { Type } from "class-transformer";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class TableFilterDto {
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
    example: "Table Name",
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: "Filter by sbu", example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  sbu_id?: number;

  @ApiPropertyOptional({ description: "Filter by sbu", example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  outlet_id?: number;

  @ApiPropertyOptional({ description: "Filter by sbu", example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  floor_id?: number;
}
