import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, MaxLength } from 'class-validator';

export class CreatePosOutletDto {
  @ApiProperty({
    description: 'Name of the POS outlet',
    example: 'Main Restaurant',
    maxLength: 255,
  })
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({
    description: 'Location of the POS outlet',
    example: 'Ground Floor, Building A',
    maxLength: 255,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  location?: string;

  @ApiProperty({
    description: 'Description of the POS outlet',
    example: 'Main dining area with 50 seating capacity',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}