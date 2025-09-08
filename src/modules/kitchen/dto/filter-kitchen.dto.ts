import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsInt, IsOptional, IsString } from "class-validator";
import { Type } from "class-transformer";
import { KitchenType } from "../enum/kitchen.enum";

export class FilterKitchenDto {
  @ApiPropertyOptional({ example: 1, description: "Page number (default: 1)" })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  page?: number = 1;

  @ApiPropertyOptional({
    example: 10,
    description: "Limit per page (default: 10)",
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  limit?: number = 10;

  @ApiPropertyOptional({
    example: "Main",
    description: "Search by kitchen name",
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    enum: KitchenType,
    description: "Filter by kitchen type",
  })
  @IsOptional()
  @IsEnum(KitchenType)
  type?: KitchenType;

  @ApiPropertyOptional({
    enum: ["Yes", "No"],
    description: "Show deleted kitchens: Yes/No (default: No)",
  })
  @IsOptional()
  is_deleted?: "Yes" | "No";

  @ApiPropertyOptional({
    enum: ["Yes", "No"],
    description: "Filter by active status: Yes/No",
  })
  @IsOptional()
  is_active?: "Yes" | "No";
}
