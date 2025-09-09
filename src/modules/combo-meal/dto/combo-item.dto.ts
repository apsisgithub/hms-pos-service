import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class ComboItemDto {
  @ApiProperty({ example: 1, description: "Product ID included in the combo" })
  @IsNumber()
  product_id: number;

  @ApiProperty({
    example: 2,
    description: "Quantity of this product in the combo",
  })
  @IsNumber()
  quantity: number;
}
