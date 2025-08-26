import { Module } from "@nestjs/common";
import { PosTablesService } from "./pos-tables.service";
import { PosTablesController } from "./pos-tables.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PosTable } from "./entities/pos-table.entity";

@Module({
    imports: [TypeOrmModule.forFeature([PosTable])],
    controllers: [PosTablesController],
    providers: [PosTablesService],
})
export class PosTablesModule { }