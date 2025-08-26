import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, MaxLength, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePosMenuDto {
  @ApiProperty({
    description: 'ID of the outlet this menu item belongs to',
    example: 1,
  })
  @Type(() => Number)
  @IsNumber()
  outlet_id: number;

  @ApiProperty({
    description: 'ID of the measurement unit for this menu item',
    example: 1,
  })
  @Type(() => Number)
  @IsNumber()
  unit_id: number;

  @ApiProperty({
    description: 'Name of the menu item',
    example: 'Grilled Chicken Breast',
    maxLength: 255,
  })
  @IsString()
  @MaxLength(255)
  item_name: string;

  @ApiProperty({
    description: 'Price of the menu item',
    example: 25.99,
    minimum: 0,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    description: 'Description of the menu item',
    example: 'Tender grilled chicken breast served with seasonal vegetables',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}