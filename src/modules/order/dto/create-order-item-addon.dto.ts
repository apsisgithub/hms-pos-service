import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNumber } from "class-validator";
import { Type } from "class-transformer";

export class CreateOrderItemAddonDto {
  @ApiProperty({ description: "Addon ID" })
  @IsInt()
  @Type(() => Number)
  product_addon_id: number;

  @ApiProperty({ description: "Product ID" })
  @IsInt()
  @Type(() => Number)
  product_id: number;

  @ApiProperty({ description: "Extra price for this addon" })
  @IsNumber()
  @Type(() => Number)
  extra_price: number;
}
