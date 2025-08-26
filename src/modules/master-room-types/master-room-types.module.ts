import { Module } from "@nestjs/common";
import { MasterRoomTypesService } from "./master-room-types.service";
import { MasterRoomTypesController } from "./master-room-types.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MasterRoomType } from "./entities/master_room_types.entity";

@Module({
    imports: [TypeOrmModule.forFeature([MasterRoomType])],
    controllers: [MasterRoomTypesController],
    providers: [MasterRoomTypesService],
})
export class MasterRoomTypesModule {}
