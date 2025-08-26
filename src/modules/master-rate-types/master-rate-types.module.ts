import { Module } from "@nestjs/common";
import { MasterRateTypesService } from "./master-rate-types.service";
import { MasterRateTypesController } from "./master-rate-types.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MasterRateType } from "./entities/master_rate_type.entity";

@Module({
    imports: [TypeOrmModule.forFeature([MasterRateType])],
    controllers: [MasterRateTypesController],
    providers: [MasterRateTypesService],
})
export class MasterRateTypesModule {}
