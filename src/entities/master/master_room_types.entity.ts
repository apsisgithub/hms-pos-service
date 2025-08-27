import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from "typeorm";
import { MasterSbu } from "src/entities/master/master_sbu.entity";
import { MasterRoom } from "src/entities/master/master_room.entity";
import { MasterRoomRate } from "src/entities/master/master_room_rates.entity";
import { CoreEntity } from "src/utils/core-entity";
import { MasterRoomTypeRate } from "src/entities/master/master_room_type_rates.entity";
import { SeasonRoomTypeMapping } from "src/entities/master/master_season_room_type_mapping.entity";
import { ReservationRoom } from "./master_reservation_room.entity";

export enum RoomTypeStatus {
  Active = "Active",
  Inactive = "Inactive",
}

@Entity("master_room_types")
export class MasterRoomType extends CoreEntity {
  @Column({ type: "varchar", length: 255, nullable: false, unique: true })
  name: string;

  @Column({ type: "int", nullable: false, default: 0 })
  sbu_id: number;

  @Column({ type: "varchar", length: 50, nullable: true })
  short_name: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ type: "int", nullable: false, default: 0 })
  base_occupancy_adult: number;

  @Column({ type: "int", nullable: false, default: 0 })
  base_occupancy_child: number;

  @Column({ type: "int", nullable: false, default: 0 })
  max_occupancy_adult: number;

  @Column({ type: "int", nullable: false, default: 0 })
  max_occupancy_child: number;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: false })
  base_price: number;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  higher_price: number;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: false })
  base_price_usd: number;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  higher_price_usd: number;

  @Column({ type: "boolean", nullable: false, default: false })
  extra_bed_allowed: boolean;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  extra_bed_price: number;

  @Column({
    type: "enum",
    enum: RoomTypeStatus,
    default: RoomTypeStatus.Active,
    nullable: false,
  })
  status: RoomTypeStatus;

  @ManyToOne(() => MasterSbu, (sbu) => sbu.roomTypes)
  @JoinColumn({ name: "sbu_id" })
  sbu: MasterSbu;

  @OneToMany(() => MasterRoom, (room) => room.roomType)
  rooms: MasterRoom[];

  @OneToMany(() => MasterRoomRate, (roomRate) => roomRate.roomType)
  roomRates: MasterRoomRate[];

  @OneToMany(() => MasterRoomTypeRate, (roomTypeRate) => roomTypeRate.roomType)
  roomTypeRates: MasterRoomTypeRate[];

  @OneToMany(
    () => ReservationRoom,
    (reservationRoom) => reservationRoom.roomType
  )
  reservationRooms: ReservationRoom[];

  @OneToMany(() => SeasonRoomTypeMapping, (mapping) => mapping.roomType)
  seasonMappings: SeasonRoomTypeMapping[];
}
