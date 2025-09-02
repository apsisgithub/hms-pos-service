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
import { MasterFloor } from "src/entities/master/master_floor.entity";
import { MasterRoom } from "src/entities/master/master_room.entity";
import { CoreEntity } from "src/utils/core-entity";

export enum BuildingStatus {
  Active = "Active",
  Inactive = "Inactive",
}

@Entity("master_buildings")
export class MasterBuilding extends CoreEntity {
  @Column({ type: "int", nullable: false })
  sbu_id: number;

  @Column({ type: "varchar", length: 255, nullable: false })
  name: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({
    type: "enum",
    enum: BuildingStatus,
    default: BuildingStatus.Active,
    nullable: false,
  })
  status: BuildingStatus;

  // Relationships
  @ManyToOne(() => MasterSbu, (sbu) => sbu.buildings)
  @JoinColumn({ name: "sbu_id" })
  sbu: MasterSbu;

  @OneToMany(() => MasterFloor, (floor) => floor.building)
  floors: MasterFloor[];

  @OneToMany(() => MasterRoom, (room) => room.building)
  rooms: MasterRoom[];
}
