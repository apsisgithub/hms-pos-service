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
import { MasterRoomRate } from "src/entities/master/master_room_rates.entity";
import { CoreEntity } from "src/utils/core-entity";
import { MasterRoomTypeRate } from "./master_room_type_rates.entity";
import { ReservationRoom } from "./master_reservation_room.entity";

export enum RateTypeStatus {
  Active = "Active",
  Inactive = "Inactive",
}

@Entity("master_rate_types")
export class MasterRateType extends CoreEntity {
  @Column({ type: "int", nullable: false })
  sbu_id: number;

  @Column({ type: "varchar", length: 255, nullable: true })
  name: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  short_code: string;

  @Column({ type: "boolean", default: false })
  is_tax_included: boolean;

  @Column({
    type: "enum",
    enum: RateTypeStatus,
    default: RateTypeStatus.Active,
    nullable: false,
  })
  status: RateTypeStatus;

  // Relationships
  @ManyToOne(() => MasterSbu, (sbu) => sbu.rateTypes)
  @JoinColumn({ name: "sbu_id" })
  sbu: MasterSbu;

  @OneToMany(() => MasterRoomRate, (roomRate) => roomRate.rateType)
  roomRates: MasterRoomRate[];

  @OneToMany(
    () => ReservationRoom,
    (reservationRoom) => reservationRoom.rateType
  )
  reservationRooms: ReservationRoom[];

  @OneToMany(() => MasterRoomTypeRate, (roomTypeRate) => roomTypeRate.rateType)
  roomTypeRates: MasterRoomTypeRate[];
}
