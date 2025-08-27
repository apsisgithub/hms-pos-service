import {
  Entity,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from "typeorm";
import { MasterSbu } from "../master/master_sbu.entity";
import { PosOutlet } from "./outlet.entity";

@Entity("pos_waiters")
export class PosWaiter {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "int" })
  sbu_id: number;

  @Column({ type: "int" })
  outlet_id: number;

  @Column({ type: "varchar", length: 100 })
  name: string;

  @Column({ type: "varchar", length: 50, unique: true })
  employee_code: string;

  @Column({ type: "varchar", length: 20, nullable: true })
  phone: string;

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
  deleted_by: number;

  @ManyToOne(() => MasterSbu, (sbu) => sbu.waiters)
  @JoinColumn({ name: "sbu_id" })
  sbu: MasterSbu;

  @ManyToOne(() => PosOutlet, (outlet) => outlet.waiters)
  @JoinColumn({ name: "outlet_id" })
  outlet: PosOutlet;
}
