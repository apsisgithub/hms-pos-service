import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { CoreEntity } from "src/utils/core-entity";
import { MasterFloor } from "../master/master_floor.entity";
import { PosOutlet } from "./outlet.entity";
import { MasterSbu } from "../master/master_sbu.entity";

export enum TableStatus {
  Available = "Available",
  Occupied = "Occupied",
  Hold = "Hold",
}

@Entity("pos_tables")
export class PosTable {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "int" })
  sbu_id: number;

  @Column({ type: "int" })
  outlet_id: number;

  @Column({ type: "int" })
  floor_id: number;

  @ManyToOne(() => MasterFloor, (floor) => floor.tables)
  @JoinColumn({ name: "floor_id" })
  floor: MasterFloor;

  @Column({ type: "varchar", length: 100 })
  table_name: string;

  @Column({ type: "varchar", length: 50 })
  table_short_code: string;

  @Column({ type: "int" })
  capacity: number;

  @Column({ type: "enum", enum: TableStatus, default: TableStatus.Available })
  status: TableStatus;

  @Column({ type: "text", nullable: true })
  remarks: string;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  created_at: Date;

  @Column({ type: "int", nullable: true })
  created_by: number;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updated_at: Date;

  @Column({ type: "int", nullable: true })
  updated_by: number;

  @DeleteDateColumn({ name: "deleted_at", type: "timestamp" })
  deleted_at: Date;

  @Column({ type: "int", nullable: true })
  deleted_by: number | null;

  @ManyToOne(() => MasterSbu, (sbu) => sbu.tables)
  @JoinColumn({ name: "sbu_id" })
  sbu: MasterSbu;

  @ManyToOne(() => PosOutlet, (outlet) => outlet.tables)
  @JoinColumn({ name: "outlet_id" })
  outlet: PosOutlet;
}
