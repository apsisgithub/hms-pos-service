import { Module } from "@nestjs/common";
import { CounterService } from "./counter.service";
import { CounterController } from "./counter.controller";
import { PosCounter } from "src/entities/pos/counter.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([PosCounter])],
  controllers: [CounterController],
  providers: [CounterService],
  exports: [CounterService],
})
export class CounterModule {}
