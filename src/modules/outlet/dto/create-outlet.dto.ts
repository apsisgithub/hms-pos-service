import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEmail,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateOutletDto {
  @ApiProperty({ example: 1, description: "SBU ID (foreign key)" })
  @IsInt()
  sbu_id: number;

  @ApiProperty({ example: "Banani Outlet", description: "Name of the outlet" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    example: "logo.png",
    description: "Logo of the outlet",
  })
  @IsOptional()
  @IsString()
  logo?: string;

  @ApiPropertyOptional({
    example: "outlet@example.com",
    description: "Outlet email",
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    example: "+880123456789",
    description: "Outlet phone number",
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    example: "Banani, Dhaka",
    description: "Outlet location",
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({
    example: "Main POS outlet for SBU",
    description: "Description",
  })
  @IsOptional()
  @IsString()
  description?: string;
}
