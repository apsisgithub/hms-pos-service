import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, IsEnum, IsNumberString } from "class-validator";
import { OrderStatus, OrderType } from "src/entities/pos/order.entity";

export class FilterOrderDto {
  @ApiPropertyOptional({ description: "Page number", example: 1 })
  @IsOptional()
  @IsNumberString()
  page?: number;

  @ApiPropertyOptional({
    description: "Number of records per page",
    example: 10,
  })
  @IsOptional()
  @IsNumberString()
  limit?: number;

  @ApiPropertyOptional({ description: "Search by order number" })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    enum: OrderStatus,
    description: "Filter by order status",
  })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @ApiPropertyOptional({ enum: OrderType, description: "Filter by order type" })
  @IsOptional()
  @IsEnum(OrderType)
  order_type?: OrderType;
}
