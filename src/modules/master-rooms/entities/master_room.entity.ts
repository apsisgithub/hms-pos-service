import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    OneToMany,
} from "typeorm";
import { MasterSbu } from "src/modules/master-sbu/entities/master_sbu.entity";
import { MasterRoomType } from "src/modules/master-room-types/entities/master_room_types.entity";
import { MasterFloor } from "src/modules/master-floors/entities/master_floor.entity";
import { MasterBuilding } from "src/modules/master-buildings/entities/master_building.entity";
import { ReservationRoom } from "src/modules/master-reservation/entities/master_reservation_room.entity";
import { JointRoomMappingRoom } from "./master_joint_room_mapping_room.entity";
import { MasterCharges } from "src/modules/master-reservation/entities/master_charges.entity";
import { MasterFolios } from "src/modules/master-reservation/entities/master_folios.entity";
import { FoliosRoomsMapping } from "src/modules/master-reservation/entities/folios_rooms_mapping.entity";

export enum RoomOccupancyStatus {
    Available = "available",
    Occupied = "occupied",
    Maintenance = "maintenance",
    OutOfService = "out_of_service",
    Dirty = "dirty",
}

export enum RoomGeneralStatus {
    Active = "Active",
    Inactive = "Inactive",
}

@Entity("master_rooms")
export class MasterRoom {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "int", nullable: false })
    sbu_id: number;

    @Column({ type: "varchar", length: 50, nullable: false })
    room_number: string;

    @Column({ type: "varchar", length: 50, nullable: true })
    room_code: string;

    @Column({ type: "int", nullable: true })
    room_type_id: number;

    @Column({ type: "int", nullable: true })
    floor_id: number;

    @Column({ type: "int", nullable: true })
    building_id: number;

    @Column({ type: "text", nullable: true })
    description: string;

    @Column({
        type: "enum",
        enum: RoomOccupancyStatus,
        default: RoomOccupancyStatus.Available,
    })
    status: RoomOccupancyStatus; // Existing status for occupancy

    @Column({
        type: "enum",
        enum: RoomGeneralStatus,
        default: RoomGeneralStatus.Active,
        nullable: false,
        name: "general_status",
    })
    generalStatus: RoomGeneralStatus; // New status for Active/Inactive

    @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
    room_rate: number;

    @CreateDateColumn({ type: "timestamp" })
    created_at: Date;

    @Column({ type: "int", nullable: true })
    created_by: number;

    @UpdateDateColumn({ type: "timestamp" })
    updated_at: Date;

    @Column({ type: "int", nullable: true })
    updated_by: number;

    @DeleteDateColumn({ type: "timestamp" })
    deleted_at: Date;

    @Column({ type: "int", nullable: true })
    deleted_by: number;

    // Relationships
    @ManyToOne(() => MasterSbu, (sbu) => sbu.rooms)
    @JoinColumn({ name: "sbu_id" })
    sbu: MasterSbu;

    @ManyToOne(() => MasterRoomType, (roomType) => roomType.rooms)
    @JoinColumn({ name: "room_type_id" })
    roomType: MasterRoomType;

    @ManyToOne(() => MasterFloor, (floor) => floor.rooms)
    @JoinColumn({ name: "floor_id" })
    floor: MasterFloor;

    @ManyToOne(() => MasterBuilding, (building) => building.rooms)
    @JoinColumn({ name: "building_id" })
    building: MasterBuilding;

    @OneToMany(() => ReservationRoom, (reservationRoom) => reservationRoom.room)
    reservationRooms: ReservationRoom[];

    @OneToMany(
        () => JointRoomMappingRoom,
        (jointRoomRoom) => jointRoomRoom.masterRoom
    )
    jointRoomRooms: JointRoomMappingRoom[];

    @OneToMany(() => FoliosRoomsMapping, (mapping) => mapping.room)
    foliosRoomsMappings: FoliosRoomsMapping[];
}
