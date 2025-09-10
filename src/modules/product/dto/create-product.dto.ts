import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsInt,
  IsOptional,
  IsString,
  IsNumber,
  IsBoolean,
  IsDate,
  IsArray,
  ValidateNested,
} from "class-validator";

// ---------- VARIANT DTO ----------
export class ProductVariantDto {
  @ApiProperty({ description: "Variant name" })
  @IsString()
  variant_name: string;

  @ApiProperty({ description: "Variant SKU" })
  @IsString()
  sku: string;

  @ApiProperty({ description: "Base price" })
  @IsNumber()
  base_price: number;

  @ApiProperty({ description: "Discount" })
  @IsNumber()
  discount: number;

  @ApiProperty({ description: "Variant price" })
  @IsNumber()
  price: number;
}

// ---------- ADDON DTO ----------
export class ProductAddonDto {
  @ApiProperty({ example: 1, description: "Addon ID (foreign key)" })
  @IsInt()
  addon_id: number;

  @ApiPropertyOptional({
    example: 1.5,
    description: "Override addon price (if different from default)",
  })
  @IsOptional()
  @IsNumber()
  extra_price?: number;
}

// ---------- PRODUCT DTO ----------
export class CreateProductDto {
  @ApiProperty({ example: 1, description: "SBU ID (foreign key)" })
  @IsInt()
  sbu_id: number;

  @ApiProperty({ example: 1, description: "SBU ID (foreign key)" })
  @IsInt()
  outlet_id: number;

  @ApiProperty({ example: 1, description: "Category ID (foreign key)" })
  @IsInt()
  category_id: number;

  @ApiProperty({ example: 1, description: "Sub Category ID (foreign key)" })
  @IsInt()
  subcategory_id: number;

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

  // ---------- VARIANTS ----------
  @ApiPropertyOptional({
    type: [ProductVariantDto],
    description: "List of product variants",
    example: [
      { variant_name: "Small", sku: "PIZ-SM", price: 5.0 },
      { variant_name: "Medium", sku: "PIZ-MD", price: 7.5 },
      { variant_name: "Large", sku: "PIZ-LG", price: 10.0 },
    ],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductVariantDto)
  variants?: ProductVariantDto[];

  // ---------- ADDONS ----------
  @ApiPropertyOptional({
    type: [ProductAddonDto],
    description: "List of addons available for the product",
    example: [
      { addon_id: 1, extra_price: 1.5 },
      { addon_id: 2, extra_price: 1.0 },
    ],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductAddonDto)
  addons?: ProductAddonDto[];
}
