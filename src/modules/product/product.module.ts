import { Module } from "@nestjs/common";
import { ProductService } from "./product.service";
import { ProductController } from "./product.controller";
import { Product } from "src/entities/pos/products.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductAddon } from "src/entities/pos/product_addons.entity";
import { ProductVariant } from "src/entities/pos/product-varient.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductAddon, ProductVariant])],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
