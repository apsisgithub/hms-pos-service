import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from "typeorm";
import { MasterSbu } from "src/entities/master/master_sbu.entity";
import { MasterRoomRate } from "src/entities/master/master_room_rates.entity";
import { CoreEntity } from "src/utils/core-entity";
import { SeasonRoomTypeMapping } from "./master_season_room_type_mapping.entity";

export enum SeasonStatus {
  Active = "Active",
  Inactive = "Inactive",
}

@Entity("master_seasons")
@Index("composition_idx_short_code", ["sbu_id", "short_code"], { unique: true })
export class MasterSeason extends CoreEntity {
  @Column({ type: "int", nullable: false })
  sbu_id: number;

  @Column({ type: "varchar", length: 50, nullable: false })
  short_code: string;

  @Column({ type: "varchar", length: 255, nullable: false })
  season_name: string;

  @Column({ type: "int", nullable: false })
  from_day: number;

  @Column({ type: "int", nullable: false })
  to_day: number;

  @Column({ type: "int", nullable: false })
  from_month: number;

  @Column({ type: "int", nullable: false })
  to_month: number;

  // The 'Expiration date' is a full date
  @Column({ type: "date", nullable: false })
  expiration_date: Date;

  @Column({
    type: "enum",
    enum: SeasonStatus,
    default: SeasonStatus.Active,
    nullable: false,
  })
  status: SeasonStatus;

  // Relationships
  @ManyToOne(() => MasterSbu, (sbu) => sbu.seasons)
  @JoinColumn({ name: "sbu_id" })
  sbu: MasterSbu;

  @OneToMany(() => MasterRoomRate, (roomRate) => roomRate.season)
  roomRates: MasterRoomRate[];

  @OneToMany(() => SeasonRoomTypeMapping, (mapping) => mapping.season)
  seasonRoomTypeMappings: SeasonRoomTypeMapping[];
}
