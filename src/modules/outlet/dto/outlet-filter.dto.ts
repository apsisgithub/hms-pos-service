import { IsBoolean, IsInt, IsOptional, IsString, Min } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";

export class OutletFilterDto {
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
    example: "Banani",
  })
  @IsOptional()
  @IsString()
  search?: string;

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
}
