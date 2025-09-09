import { Module } from "@nestjs/common";
import { KitchenService } from "./kitchen.service";
import { KitchenController } from "./kitchen.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "src/entities/pos/products.entity";
import { Kitchen } from "src/entities/pos/kitchen.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Kitchen, Product])],
  controllers: [KitchenController],
  providers: [KitchenService],
  exports: [KitchenService],
})
export class KitchenModule {}
