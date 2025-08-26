// src/modules/joint-rooms/entities/joint_room_room.entity.ts

import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    Unique,
} from "typeorm";

import { JointRoom } from "./master_joint_room.entity";
import { MasterRoom } from "src/modules/master-rooms/entities/master_room.entity";
import { CoreEntity } from "src/utils/core-entity";

@Entity("master_joint_room_mapping_rooms")
@Unique(["joint_room_id", "room_id"]) // Prevents duplicate links (e.g., JointRoom A - Room X added twice)
export class JointRoomMappingRoom extends CoreEntity {
    @Column({ type: "int", nullable: false })
    joint_room_id: number;

    @Column({ type: "int", nullable: false })
    room_id: number;

    @ManyToOne(() => JointRoom, (jointRoom) => jointRoom.jointRoomRooms, {
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "joint_room_id" })
    jointRoom: JointRoom;

    @ManyToOne(() => MasterRoom, (masterRoom) => masterRoom.jointRoomRooms, {
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "room_id" })
    masterRoom: MasterRoom;
}
