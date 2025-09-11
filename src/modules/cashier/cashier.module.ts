import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PosCashier } from "src/entities/pos/cashier.entity";
import { CashierService } from "./cashier.service";
import { CashierController } from "./cashier.controller";

@Module({
  imports: [TypeOrmModule.forFeature([PosCashier])],
  controllers: [CashierController],
  providers: [CashierService],
  exports: [CashierService],
})
export class CashierModule {}
