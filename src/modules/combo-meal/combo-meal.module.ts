import { Module } from "@nestjs/common";
import { ComboMealService } from "./combo-meal.service";
import { ComboMealController } from "./combo-meal.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ComboMeal } from "src/entities/pos/combo_meals.entity";
import { ComboMealProduct } from "src/entities/pos/combo_meal_products.entity";
import { Product } from "src/entities/pos/products.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Product, ComboMeal, ComboMealProduct])],
  controllers: [ComboMealController],
  providers: [ComboMealService],
  exports: [ComboMealService],
})
export class ComboMealModule {}
