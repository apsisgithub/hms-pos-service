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
import { MasterSbu } from "src/entities/master/master_sbu.entity";
import { MasterRoomType } from "src/entities/master/master_room_types.entity";
import { MasterRateType } from "src/entities/master/master_rate_type.entity";
import { MasterSeason } from "src/entities/master/master_seasons.entity";

export enum RoomRateStatus {
  Active = "Active",
  Inactive = "Inactive",
}

@Entity("master_room_rates")
export class MasterRoomRate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "int", nullable: false })
  sbu_id: number;

  @Column({ type: "int", nullable: false })
  room_type_id: number;

  @Column({ type: "int", nullable: false })
  rate_type_id: number;

  @Column({ type: "int", nullable: true })
  season_id: number;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  price: number;

  @Column({ type: "int", nullable: true })
  installment_count: number;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  extra_adult_price: number;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  extra_child_price: number;

  @Column({
    type: "enum",
    enum: RoomRateStatus,
    default: RoomRateStatus.Active,
    nullable: false,
  })
  status: RoomRateStatus;

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
  @ManyToOne(() => MasterSbu, (sbu) => sbu.roomRates)
  @JoinColumn({ name: "sbu_id" })
  sbu: MasterSbu;

  @ManyToOne(() => MasterRoomType, (roomType) => roomType.roomRates)
  @JoinColumn({ name: "room_type_id" })
  roomType: MasterRoomType;

  @ManyToOne(() => MasterRateType, (rateType) => rateType.roomRates)
  @JoinColumn({ name: "rate_type_id" })
  rateType: MasterRateType;

  @ManyToOne(() => MasterSeason, (season) => season.roomRates)
  @JoinColumn({ name: "season_id" })
  season: MasterSeason;
}
