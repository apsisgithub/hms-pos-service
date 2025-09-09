import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEmail,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class OutletDropdownDto {
  @ApiProperty({ description: "Filter by SBU ID" })
  @IsInt()
  sbu_id?: number;

  @ApiPropertyOptional({
    description: "Search by name",
  })
  @IsOptional()
  @IsString()
  search?: string;
}
