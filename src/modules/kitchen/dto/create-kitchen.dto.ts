import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsBoolean,
  IsNumber,
} from "class-validator";
import {
  KitchenType,
  KitchenStatus,
} from "src/modules/kitchen/enum/kitchen.enum";

export class CreateKitchenDto {
  @ApiProperty({ example: 1, description: "SBU ID" })
  @IsInt()
  sbu_id: number;

  @ApiPropertyOptional({ example: 1, description: "Outlet ID" })
  @IsOptional()
  @IsInt()
  outlet_id?: number;

  @ApiProperty({ example: "Main Kitchen", description: "Kitchen name" })
  @IsString()
  name: string;

  @ApiProperty({ example: "1st Floor", description: "Kitchen location" })
  @IsString()
  location: string;

  @ApiProperty({
    enum: KitchenType,
    example: KitchenType.KITCHEN,
    description: "Type of kitchen",
  })
  @IsEnum(KitchenType)
  type: KitchenType;

  @ApiProperty({
    enum: KitchenStatus,
    example: KitchenStatus.ACTIVE,
    description: "Kitchen status",
  })
  @IsEnum(KitchenStatus)
  status: KitchenStatus;

  @ApiProperty({ example: true, description: "Is kitchen open" })
  @IsBoolean()
  is_open: boolean;

  @ApiPropertyOptional({
    // example: "2025-09-10T10:00:00Z",
    description: "When the kitchen was opened",
  })
  @IsOptional()
  opened_at?: Date | null;

  @ApiPropertyOptional({
    // example: "2025-09-10T22:00:00Z",
    description: "When the kitchen was closed",
  })
  @IsOptional()
  closed_at?: Date | null;

  @ApiPropertyOptional({
    example: "KitchenPrinter01",
    description: "Printer name",
  })
  @IsOptional()
  @IsString()
  printer_name?: string;

  @ApiPropertyOptional({
    example: "192.168.1.50",
    description: "Printer IP address",
  })
  @IsOptional()
  @IsString()
  printer_ip?: string;

  @ApiPropertyOptional({ example: 9100, description: "Printer port" })
  @IsOptional()
  @IsNumber()
  printer_port?: number;

  @ApiProperty({ example: true, description: "Is printer enabled" })
  @IsBoolean()
  printer_enabled: boolean;
}
