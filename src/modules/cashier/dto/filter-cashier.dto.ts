import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsInt,
  IsNotEmpty,
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
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  @IsInt()
  @Min(1)
  limit?: number;

  @ApiProperty({ description: "Filter by SBU ID", required: true })
  @IsNotEmpty()
  @IsNumber()
  @IsInt()
  sbu_id?: number;

  @ApiProperty({
    description: "Filter by Outlet ID",
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  @IsInt()
  outlet_id?: number;

  @ApiPropertyOptional({ enum: ["Yes", "No"] })
  @IsOptional()
  is_deleted?: "Yes" | "No";

  @ApiProperty({
    description: "Search term for waiter name or employee code",
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;
}
