import { IsNotEmpty, IsOptional, IsNumber, IsString } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateCategoryDto {
  @ApiProperty({
    description: "The name of the category",
    example: "Electronics",
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: "category images",
  })
  @IsOptional()
  @IsString()
  picture?: string;

  @ApiPropertyOptional({
    description: "Parent category ID if this is a subcategory",
    example: 0,
  })
  @IsOptional()
  @IsNumber()
  parent_id?: number;

  @ApiProperty({
    description: "Identifier for the SBU in the SaaS application",
  })
  @IsNumber()
  sbu_id: number;

  @ApiProperty({
    description: "Identifier for the OUtlet specific category",
  })
  @IsNumber()
  outlet_id: number;
}
