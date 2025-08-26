import { Module } from "@nestjs/common";
import { MasterRoomsService } from "./master-rooms.service";
import { MasterRoomsController } from "./master-rooms.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MasterRoom } from "./entities/master_room.entity";
import { JointRoom } from "./entities/master_joint_room.entity";
import { JointRoomMappingRoom } from "./entities/master_joint_room_mapping_room.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([MasterRoom, JointRoom, JointRoomMappingRoom]),
    ],
    controllers: [MasterRoomsController],
    providers: [MasterRoomsService],
    exports:[MasterRoomsService]
})
export class MasterRoomsModule {}
