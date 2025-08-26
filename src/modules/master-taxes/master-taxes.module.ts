import { Module } from "@nestjs/common";
import { MasterTaxesService } from "./master-taxes.service";
import { MasterTaxesController } from "./master-taxes.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MasterTax } from "./entities/master_tax.entity";

@Module({
    imports: [TypeOrmModule.forFeature([MasterTax])],
    controllers: [MasterTaxesController],
    providers: [MasterTaxesService],
    exports: [MasterTaxesService],
})
export class MasterTaxesModule {}
