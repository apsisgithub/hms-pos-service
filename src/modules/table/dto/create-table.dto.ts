import { ApiProperty } from "@nestjs/swagger";
import {
  IsInt,
  IsString,
  IsNotEmpty,
  Min,
  IsEnum,
  IsOptional,
  IsNumber,
} from "class-validator";
import { TableStatus } from "src/entities/pos/table.entity";

export class CreateTableDto {
  @ApiProperty({ description: "ID of the SBU", example: 1 })
  @IsNotEmpty()
  @IsNumber()
  @IsInt()
  sbu_id: number;

  @ApiProperty({ description: "ID of the Outlet", example: 2 })
  @IsNotEmpty()
  @IsNumber()
  @IsInt()
  outlet_id: number;

  @ApiProperty({ description: "ID of the Floor", example: 2 })
  @IsNotEmpty()
  @IsNumber()
  @IsInt()
  floor_id: number;

  @ApiProperty({ description: "Name of the table", example: "Table 101" })
  @IsNotEmpty()
  @IsString()
  table_name: string;

  @ApiProperty({ description: "Short code for the table", example: "T101" })
  @IsNotEmpty()
  @IsString()
  table_short_code: string;

  @ApiProperty({
    description: "Seating capacity of the table",
    example: 4,
    minimum: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  @IsInt()
  @Min(1)
  capacity: number;

  @ApiProperty({
    description: "Current status of the table",
    enum: TableStatus,
    example: TableStatus.Available,
    required: false,
  })
  @IsOptional()
  @IsEnum(TableStatus)
  status: TableStatus;

  @ApiProperty({
    description: "Additional remarks about the table",
    example: "Near the window",
    required: false,
  })
  @IsOptional()
  @IsString()
  remarks: string;
}
