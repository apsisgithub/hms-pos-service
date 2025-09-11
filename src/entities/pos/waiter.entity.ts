import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Generated,
  OneToOne,
} from "typeorm";
import { MasterSbu } from "../master/master_sbu.entity";
import { Outlet } from "./outlet.entity";
import { MasterUser } from "../master/master_user.entity";

@Entity("pos_waiters")
export class Waiter {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "uuid", unique: true })
  @Generated("uuid")
  uuid: string;

  @Column({ type: "int" })
  sbu_id: number;

  @Column({ type: "int" })
  outlet_id: number;

  @Column({ type: "int" })
  user_id: number;

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

  @ManyToOne(() => Outlet, (outlet) => outlet.waiters)
  @JoinColumn({ name: "outlet_id" })
  outlet: Outlet;

  @ManyToOne(() => MasterSbu, (sbu) => sbu.waiters)
  @JoinColumn({ name: "sbu_id" })
  sbu: MasterSbu;

  @OneToOne(() => MasterUser, (user) => user.waiter)
  @JoinColumn({ name: "user_id" })
  user: MasterUser;
}
