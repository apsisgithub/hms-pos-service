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
import { MasterBuilding } from "src/entities/master/master_building.entity";
import { MasterRoom } from "src/entities/master/master_room.entity";

export enum FloorStatus {
  Active = "Active",
  Inactive = "Inactive",
}

@Entity("master_floors")
export class MasterFloor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "int", nullable: false })
  sbu_id: number;

  @Column({ type: "int", nullable: false })
  building_id: number;

  @Column({ type: "varchar", length: 100, nullable: false })
  name: string;

  @Column({ type: "int", nullable: false })
  number: number;

  @Column({ type: "int", nullable: true })
  sort_order: number;

  @Column({
    type: "enum",
    enum: FloorStatus,
    default: FloorStatus.Active,
    nullable: false,
  })
  status: FloorStatus;

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
  @ManyToOne(() => MasterSbu, (sbu) => sbu.floors)
  @JoinColumn({ name: "sbu_id" })
  sbu: MasterSbu;

  @ManyToOne(() => MasterBuilding, (building) => building.floors)
  @JoinColumn({ name: "building_id" })
  building: MasterBuilding;

  @OneToMany(() => MasterRoom, (room) => room.floor)
  rooms: MasterRoom[];
}
