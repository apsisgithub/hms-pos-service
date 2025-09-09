import { ApiProperty } from "@nestjs/swagger";
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from "class-validator";
import { KitchenType } from "../enum/kitchen.enum";

export class CreateKitchenDto {
  @ApiProperty({ example: "Main Kitchen" })
  @IsString()
  name: string;

  @ApiProperty({
    enum: KitchenType,
    example: KitchenType.KITCHEN,
    description: "Type of kitchen",
  })
  @IsEnum(KitchenType)
  type: KitchenType;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsInt()
  outlet_id?: number;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
