import {
  IsInt,
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateWaiterDto {
  @ApiProperty({ description: "ID of the SBU", example: 1 })
  @IsNotEmpty()
  @IsNumber()
  @IsInt()
  sbu_id: number;

  @ApiProperty({ description: "ID of the Outlet", example: 101 })
  @IsNotEmpty()
  @IsNumber()
  @IsInt()
  outlet_id: number;

  @ApiProperty({ description: "Full name of the waiter", example: "John Doe" })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: "Unique employee code",
    example: "EMP12345",
  })
  @IsOptional()
  @IsString()
  employee_code?: string;

  @ApiPropertyOptional({ description: "Profile Picture" })
  @IsOptional()
  @IsString()
  picture?: string;

  @ApiProperty({
    description: "Phone number of the waiter",
    example: "0123456789",
    required: false,
  })
  @IsOptional()
  @IsString()
  phone?: string;
}
