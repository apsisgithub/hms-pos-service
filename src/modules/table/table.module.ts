import { Module } from "@nestjs/common";
import { PosTableService } from "./table.service";
import { PosTableController } from "./table.controller";
import { PosTable } from "src/entities/pos/table.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([PosTable])],
  controllers: [PosTableController],
  providers: [PosTableService],
  exports: [PosTableService],
})
export class PosTableModule {}
