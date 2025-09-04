import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsInt,
  IsOptional,
  IsString,
  IsNumber,
  IsBoolean,
  IsDate,
} from "class-validator";

export class CreateProductDto {
  @ApiProperty({ example: 1, description: "SBU ID (foreign key)" })
  @IsInt()
  sbu_id: number;

  @ApiProperty({ example: 1, description: "Category ID (foreign key)" })
  @IsInt()
  category_id: number;

  @ApiPropertyOptional({
    example: "Grilled Chicken Burger",
    description: "Name of the product",
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    example: "burger.jpg",
    description: "Main product image (file name or URL)",
  })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiPropertyOptional({
    example: "Chicken, Lettuce, Cheese, Bun",
    description: "Product components or ingredients",
  })
  @IsOptional()
  @IsString()
  component?: string;

  @ApiPropertyOptional({
    example: "A juicy grilled chicken burger served with fries",
    description: "Detailed description of the product",
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: "Spicy option available",
    description: "Additional product notes",
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({
    example: "Dinner",
    description: "Menu type (e.g., Breakfast, Lunch, Dinner)",
  })
  @IsOptional()
  @IsString()
  menu_type?: string;

  @ApiPropertyOptional({
    example: 15.5,
    description: "Product VAT percentage",
  })
  @IsOptional()
  @IsNumber()
  product_vat?: number;

  @ApiPropertyOptional({
    example: 1,
    description: "Whether product is special (1 = Yes, 0 = No)",
  })
  @IsOptional()
  @IsInt()
  is_special?: number;

  @ApiPropertyOptional({
    example: 1,
    description: "Offer availability (1 = Available, 0 = Not available)",
  })
  @IsOptional()
  @IsInt()
  offer_is_available?: number;

  @ApiPropertyOptional({
    example: "2025-09-01",
    description: "Offer start date",
  })
  @IsOptional()
  @IsDate()
  offer_start_date?: Date;

  @ApiPropertyOptional({
    example: "2025-09-10",
    description: "Offer end date",
  })
  @IsOptional()
  @IsDate()
  offer_end_date?: Date;

  @ApiPropertyOptional({
    example: 5,
    description: "Position/order of the product in the menu",
  })
  @IsOptional()
  @IsInt()
  position?: number;

  @ApiProperty({ example: 2, description: "Kitchen ID (foreign key)" })
  @IsInt()
  kitchen_id: number;

  @ApiPropertyOptional({
    example: 0,
    description: "Whether product belongs to a group (1 = Yes, 0 = No)",
  })
  @IsOptional()
  @IsInt()
  is_group?: number;

  @ApiPropertyOptional({
    example: 1,
    description: "Allow custom quantity (1 = Yes, 0 = No)",
  })
  @IsOptional()
  @IsInt()
  is_custom_qty?: number;

  @ApiPropertyOptional({
    example: "00:15:00",
    description: "Cooked time in HH:MM:SS format",
  })
  @IsOptional()
  @IsString()
  cooked_time?: string;

  @ApiPropertyOptional({
    example: true,
    description: "Whether the product is active",
  })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean | null;

  @ApiPropertyOptional({
    example: "Customer prefers extra cheese",
    description: "Customer note for special instructions",
  })
  @IsOptional()
  @IsString()
  customer_note?: string;
}
