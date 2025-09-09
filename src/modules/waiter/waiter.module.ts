import { Module } from "@nestjs/common";
import { WaiterService } from "./waiter.service";
import { WaiterController } from "./waiter.controller";
import { Waiter } from "src/entities/pos/waiter.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([Waiter])],
  controllers: [WaiterController],
  providers: [WaiterService],
  exports: [WaiterService],
})
export class WaiterModule {}
