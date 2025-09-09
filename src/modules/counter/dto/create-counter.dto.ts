import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateCounterDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  sbu_id: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  outlet_id: number;

  @ApiProperty({ example: "Front Counter" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: "Ground floor, near entrance" })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ example: "Handles walk-in orders" })
  @IsOptional()
  @IsString()
  description?: string;
}
