import { Module } from "@nestjs/common";
import { MasterMeasurementUnitService } from "./master-measurement-unit.service";
import { MasterMeasurementUnitController } from "./master-measurement-unit.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MasterMeasurementUnit } from "./entities/master_measurement_unit.entity";

@Module({
    imports: [TypeOrmModule.forFeature([MasterMeasurementUnit])],
    controllers: [MasterMeasurementUnitController],
    providers: [MasterMeasurementUnitService],
})
export class MasterMeasurementUnitModule {}
