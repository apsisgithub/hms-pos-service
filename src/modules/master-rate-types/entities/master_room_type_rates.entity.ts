// src/modules/master-room-type-rates/entities/master_room_type_rate.entity.ts

import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
} from "typeorm";

// Assume these entities exist in your project for foreign key relationships
import { MasterRateType } from "src/modules/master-rate-types/entities/master_rate_type.entity"; // Adjust path as necessary
import { MasterRoomType } from "src/modules/master-room-types/entities/master_room_types.entity"; // Adjust path as necessary

export enum RoomTypeRateStatus {
    Active = "Active",
    Inactive = "Inactive",
}

@Entity("master_room_type_rates") // Table name in your database
export class MasterRoomTypeRate {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "int", nullable: false })
    rate_type_id: number; // Foreign Key to MasterRateType

    @Column({ type: "int", nullable: false })
    room_type_id: number; // Foreign Key to MasterRoomType (renamed from 'room_type' for FK clarity)

    @Column({
        type: "decimal",
        precision: 10,
        scale: 2,
        nullable: false,
        default: 0,
    })
    rack_rate: number; // Base rate for this room type under this rate type

    @Column({
        type: "decimal",
        precision: 10,
        scale: 2,
        nullable: false,
        default: 0,
    })
    extra_child_rate: number; // Rate for an extra child

    @Column({
        type: "decimal",
        precision: 10,
        scale: 2,
        nullable: false,
        default: 0,
    })
    extra_adult_rate: number; // Rate for an extra adult

    @Column({
        type: "enum",
        enum: RoomTypeRateStatus,
        default: RoomTypeRateStatus.Active,
        nullable: false,
    })
    status: RoomTypeRateStatus;

    @CreateDateColumn({ type: "timestamp" })
    created_at: Date;

    @Column({ type: "int", nullable: true })
    created_by: number;

    @UpdateDateColumn({ type: "timestamp" })
    updated_at: Date;

    @Column({ type: "int", nullable: true })
    updated_by: number;

    @DeleteDateColumn({ type: "timestamp", nullable: true })
    deleted_at: Date;

    @Column({ type: "int", nullable: true })
    deleted_by: number;

    @ManyToOne(() => MasterRateType, (rateType) => rateType.roomTypeRates)
    @JoinColumn({ name: "rate_type_id" })
    rateType: MasterRateType; // Defines the Many-to-One relationship with MasterRateType

    @ManyToOne(() => MasterRoomType, (roomType) => roomType.roomTypeRates)
    @JoinColumn({ name: "room_type_id" })
    roomType: MasterRoomType; // Defines the Many-to-One relationship with MasterRoomType
}
