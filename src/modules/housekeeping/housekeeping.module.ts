import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { HousekeepingController } from "./housekeeping.controller";
import { HousekeepingService } from "./housekeeping.service";
import { HousekeepingWorkOrder } from "./entities/housekeeping_work_order.entity";
import { HousekeepingWorkOrderLog } from "./entities/housekeeping_work_order_log.entity";
import { QueryManagerService } from "src/common/query-manager/query.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            HousekeepingWorkOrder,
            HousekeepingWorkOrderLog
        ])
    ],
    controllers: [HousekeepingController],
    providers: [HousekeepingService, QueryManagerService],
    exports: [HousekeepingService]
})
export class HousekeepingModule {}