import { IsOptional, IsInt, IsNumber, IsString } from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CategoryDropdownDto {
  @ApiProperty({
    description: "Identifier for the SBU in the SaaS application",
  })
  @IsNumber()
  sbu_id?: number;

  @ApiProperty({
    description: "Identifier for the OUtlet specific category",
  })
  @IsNumber()
  outlet_id?: number;
  @ApiPropertyOptional({
    description: "Filter by parent category ID (for subcategories)",
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  parent_id?: number;

  @ApiPropertyOptional({
    description: "Search by category name",
  })
  @IsOptional()
  @IsString()
  search?: string;
}
