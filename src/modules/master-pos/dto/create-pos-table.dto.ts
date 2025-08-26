import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsEnum, IsOptional, MaxLength, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { TableStatus } from '../entities/pos-table.entity';

export class CreatePosTableDto {
  @ApiProperty({
    description: 'ID of the outlet this table belongs to',
    example: 1,
  })
  @Type(() => Number)
  @IsNumber()
  outlet_id: number;

  @ApiProperty({
    description: 'Name of the table',
    example: 'Table 1',
    maxLength: 100,
  })
  @IsString()
  @MaxLength(100)
  table_name: string;

  @ApiProperty({
    description: 'Short code for the table',
    example: 'T01',
    maxLength: 50,
  })
  @IsString()
  @MaxLength(50)
  table_short_code: string;

  @ApiProperty({
    description: 'Seating capacity of the table',
    example: 4,
    minimum: 1,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  capacity: number;

  @ApiProperty({
    description: 'Current status of the table',
    enum: TableStatus,
    example: TableStatus.Available,
    required: false,
  })
  @IsOptional()
  @IsEnum(TableStatus)
  status?: TableStatus;

  @ApiProperty({
    description: 'Additional remarks about the table',
    example: 'Near window, good for couples',
    required: false,
  })
  @IsOptional()
  @IsString()
  remarks?: string;
}