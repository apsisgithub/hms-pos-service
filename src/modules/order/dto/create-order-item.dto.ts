import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsInt,
  IsNumber,
  IsOptional,
  IsEnum,
  IsNotEmpty,
  ValidateNested,
  IsArray,
} from "class-validator";
import { Type } from "class-transformer";
import { CreateOrderItemAddonDto } from "./create-order-item-addon.dto";
import { DiscountType, ItemStatus } from "src/entities/pos/order_items.entity";

export class CreateOrderItemDto {
  @ApiProperty({ description: "Product ID" })
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  product_id: number;

  @ApiPropertyOptional({ description: "Variant ID" })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  variant_id?: number | null;

  @ApiProperty({ description: "Quantity of product" })
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  quantity: number;

  @ApiProperty({ description: "Unit price of product/variant" })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  unit_price: number;

  @ApiProperty({ description: "total price of product addon" })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  addon_price: number;

  @ApiPropertyOptional({
    enum: DiscountType,
    description: "Discount type for this item",
  })
  @IsEnum(DiscountType)
  @IsOptional()
  discount_type?: DiscountType | null;

  @ApiProperty({ description: "Discount value" })
  @IsNumber()
  @Type(() => Number)
  discount: number | null;

  @ApiProperty({ description: "Subtotal including addons" })
  @IsNumber()
  @Type(() => Number)
  subtotal: number;

  @ApiPropertyOptional({
    description: "Remarks for this item",
    example: "Extra spicy",
  })
  remarks?: string | null;

  @ApiPropertyOptional({
    type: [CreateOrderItemAddonDto],
    description: "List of addons for this item",
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemAddonDto)
  addons?: CreateOrderItemAddonDto[];

  // @ApiProperty({ enum: ItemStatus, description: "Item status" })
  // @IsEnum(ItemStatus)
  // status: ItemStatus;
}
