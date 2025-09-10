import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  IsArray,
  IsInt,
  IsNotEmpty,
} from "class-validator";
import { OrderStatus, OrderType } from "src/entities/pos/order.entity";
import { CreateOrderItemDto } from "./create-order-item.dto";

export class CreateOrderDto {
  @ApiProperty({ description: "SBU ID" })
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  sbu_id: number;

  @ApiProperty({ description: "Outlet ID" })
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  outlet_id: number;

  @ApiProperty({
    enum: OrderType,
    example: OrderType.DINE_IN,
    description: "Type of kitchen",
  })
  @IsEnum(OrderType)
  order_type: OrderType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  table_id?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  waiter_id?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  guest_count?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  room_id?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  customer_id?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  customer_preference?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  internal_note?: string;

  @ApiProperty({ required: false })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  subtotal?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  tax?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  service_charge?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  discount?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  grand_total?: number;

  //   @ApiProperty({
  //     enum: OrderStatus,
  //     required: false,
  //   })
  //   @IsEnum(OrderStatus)
  //   status: OrderStatus;

  @ApiProperty({ type: [CreateOrderItemDto], required: false })
  @IsArray()
  items: CreateOrderItemDto[];
}
