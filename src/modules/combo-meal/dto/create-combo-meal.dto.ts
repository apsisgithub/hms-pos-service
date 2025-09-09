import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsArray,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { ComboItemDto } from "./combo-item.dto";

export class CreateComboMealDto {
  @ApiProperty({
    example: "Family Meal Combo",
    description: "Name of the combo meal",
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: "Includes burger, fries, and drinks",
    description: "Combo description",
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 25.5, description: "Total price of the combo" })
  @IsNumber()
  price: number;

  @ApiProperty({
    example: true,
    description: "Is combo active",
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @ApiProperty({
    type: [ComboItemDto],
    description: "List of products in the combo",
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ComboItemDto)
  items: ComboItemDto[];
}
