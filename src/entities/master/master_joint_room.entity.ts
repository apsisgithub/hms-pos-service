// src/modules/joint-rooms/entities/joint_room.entity.ts

import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany, // Needed for the relationship to JointRoomRoom
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
} from "typeorm";

import { JointRoomMappingRoom } from "./master_joint_room_mapping_room.entity";
import { CoreEntity } from "src/utils/core-entity";

export enum JointRoomStatus {
    Active = "Active",
    Inactive = "Inactive",
}

@Entity("master_joint_rooms")
export class JointRoom extends CoreEntity {
    @Column({ type: "varchar", length: 255, nullable: false, unique: true })
    joint_room_name: string;

    @Column({ type: "int", nullable: false })
    number_of_rooms: number;

    @Column({
        type: "enum",
        enum: JointRoomStatus,
        default: JointRoomStatus.Active,
        nullable: false,
    })
    status: JointRoomStatus;

    @OneToMany(
        () => JointRoomMappingRoom,
        (jointRoomRoom) => jointRoomRoom.jointRoom
    )
    jointRoomRooms: JointRoomMappingRoom[];
}
