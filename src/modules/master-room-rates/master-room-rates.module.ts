import { Module } from "@nestjs/common";
import { MasterRoomRatesService } from "./master-room-rates.service";
import { MasterRoomRatesController } from "./master-room-rates.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MasterRoomRate } from "./entities/master_room_rates.entity";

@Module({
    imports: [TypeOrmModule.forFeature([MasterRoomRate])],
    controllers: [MasterRoomRatesController],
    providers: [MasterRoomRatesService],
})
export class MasterRoomRatesModule {}
