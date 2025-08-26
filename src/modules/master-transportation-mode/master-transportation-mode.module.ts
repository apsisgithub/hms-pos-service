import { Module } from "@nestjs/common";
import { MasterTransportationModeService } from "./master-transportation-mode.service";
import { MasterTransportationModeController } from "./master-transportation-mode.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MasterTransportationMode } from "./entities/master_transportation_mode.entity";

@Module({
    imports: [TypeOrmModule.forFeature([MasterTransportationMode])],
    controllers: [MasterTransportationModeController],
    providers: [MasterTransportationModeService],
})
export class MasterTransportationModeModule {}
