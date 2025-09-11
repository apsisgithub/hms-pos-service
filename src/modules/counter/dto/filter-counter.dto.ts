import {
  IsOptional,
  IsInt,
  IsString,
  Min,
  IsNumber,
  IsBoolean,
  IsNotEmpty,
} from "class-validator";
import { Transform, Type } from "class-transformer";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class CounterFilterDto {
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
    description: "Filter by SBU ID",
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  @IsInt()
  sbu_id?: number;

  @ApiPropertyOptional({
    description: "Filter by Outlet ID",
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  @IsInt()
  outlet_id?: number;

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

  @ApiPropertyOptional({
    description: "Search by counter name",
  })
  @IsOptional()
  @IsString()
  search?: string;
}
