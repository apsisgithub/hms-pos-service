import { Module } from "@nestjs/common";
import { MasterSeasonsService } from "./master-seasons.service";
import { MasterSeasonsController } from "./master-seasons.controller";
import { MasterSeason } from "./entities/master_seasons.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SeasonRoomTypeMapping } from "./entities/master_season_room_type_mapping.entity";
import { MasterRoomType } from "../master-room-types/entities/master_room_types.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            MasterSeason,
            SeasonRoomTypeMapping,
            MasterRoomType,
        ]),
    ],
    controllers: [MasterSeasonsController],
    providers: [MasterSeasonsService],
})
export class MasterSeasonsModule {}
