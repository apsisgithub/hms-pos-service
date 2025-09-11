import {
  IsInt,
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateCashierDto {
  @ApiProperty({ description: "ID of the SBU", example: 1 })
  @IsNotEmpty()
  @IsNumber()
  @IsInt()
  sbu_id: number;

  @ApiProperty({ description: "ID of the Outlet", example: 1 })
  @IsNotEmpty()
  @IsNumber()
  @IsInt()
  outlet_id: number;

  @ApiProperty({ description: "ID of the MasterUser", example: 1 })
  @IsNotEmpty()
  @IsNumber()
  @IsInt()
  user_id: number;
}
