import { Module } from "@nestjs/common";
import { BuildingsService } from "./buildings.service";
import { BuildingsController } from "./buildings.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MasterBuilding } from "./entities/master_building.entity";

@Module({
    imports: [TypeOrmModule.forFeature([MasterBuilding])],
    controllers: [BuildingsController],
    providers: [BuildingsService],
})
export class BuildingsModule {}
