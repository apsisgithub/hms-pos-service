import { Module } from "@nestjs/common";
import { OrderService } from "./order.service";
import { OrderController } from "./order.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Order } from "src/entities/pos/order.entity";
import { OrderItem } from "src/entities/pos/order_items.entity";
import { OrderToken } from "src/entities/pos/order_token.entity";
import { OrderValidator } from "./validator.service";
import { TokenService } from "./token.service";

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem, OrderToken])],
  controllers: [OrderController],
  providers: [OrderService, OrderValidator, TokenService],
  exports: [OrderService, OrderValidator, TokenService],
})
export class OrderModule {}
