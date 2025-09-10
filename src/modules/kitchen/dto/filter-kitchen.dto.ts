import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsInt, IsOptional, IsString } from "class-validator";
import { Type } from "class-transformer";
import { KitchenType, KitchenStatus } from "../enum/kitchen.enum";

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

  @ApiProperty({ description: "Filter by outlet ID" })
  @Type(() => Number)
  @IsInt()
  outlet_id?: number;

  @ApiProperty({ description: "Filter by outlet ID" })
  @Type(() => Number)
  @IsInt()
  sbu_id?: number;

  @ApiPropertyOptional({
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
    enum: KitchenStatus,
    description: "Filter by kitchen status",
  })
  @IsOptional()
  @IsEnum(KitchenStatus)
  status?: KitchenStatus;

  @ApiPropertyOptional({
    enum: ["Yes", "No"],
    description: "Show deleted kitchens: Yes/No (default: No)",
  })
  @IsOptional()
  is_deleted?: "Yes" | "No";

  @ApiPropertyOptional({
    enum: ["Yes", "No"],
    description: "Filter by open kitchens: Yes/No",
  })
  @IsOptional()
  is_open?: "Yes" | "No";

  @ApiPropertyOptional({
    enum: ["Yes", "No"],
    description: "Filter by printer enabled: Yes/No",
  })
  @IsOptional()
  printer_enabled?: "Yes" | "No";
}
