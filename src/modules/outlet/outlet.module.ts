import { Module } from "@nestjs/common";
import { OutletService } from "./outlet.service";
import { OutletController } from "./outlet.controller";
import { Outlet } from "src/entities/pos/outlet.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([Outlet])],
  controllers: [OutletController],
  providers: [OutletService],
  exports: [OutletService],
})
export class OutletModule {}
