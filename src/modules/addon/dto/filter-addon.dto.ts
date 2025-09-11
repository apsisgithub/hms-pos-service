import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsInt, IsString, IsIn } from "class-validator";

export class FilterAddonDto {
  @ApiPropertyOptional({ example: 1, description: "Page number" })
  @IsOptional()
  @IsInt()
  page?: number;

  @ApiPropertyOptional({ example: 10, description: "Number of items per page" })
  @IsOptional()
  @IsInt()
  limit?: number;

  @ApiPropertyOptional({
    description: "Search term for product or addon name",
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: "Filter soft deleted items (Yes/No)",
  })
  @IsOptional()
  @IsIn(["Yes", "No"])
  is_deleted?: "Yes" | "No";

  @ApiPropertyOptional({
    description: "Filter is active items (Yes/No)",
  })
  @IsOptional()
  @IsIn(["Yes", "No"])
  is_active?: "Yes" | "No";
}
