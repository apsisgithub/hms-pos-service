import {
  Entity,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
  Generated,
} from "typeorm";
import { PosWaiter } from "./waiter.entity";
import { PosTable } from "./table.entity";
import { MasterSbu } from "../master/master_sbu.entity";
import { CoreEntity } from "src/utils/core-entity";
import { Outlet } from "./outlet.entity";

@Entity("pos_counters")
export class PosCounter extends CoreEntity {
  @Column({ type: "uuid", unique: true })
  @Generated("uuid")
  uuid: string;

  @Column({ type: "int" })
  sbu_id: number;

  @Column({ type: "int" })
  outlet_id: number;

  @Column({ type: "varchar", length: 255 })
  name: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  location: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @OneToMany(() => PosTable, (table) => table.outlet)
  tables: PosTable[];

  @OneToMany(() => PosWaiter, (waiter) => waiter.outlet)
  waiters: PosWaiter[];

  @ManyToOne(() => MasterSbu, (sbu) => sbu.counters)
  @JoinColumn({ name: "sbu_id" })
  sbu: MasterSbu;

  @ManyToOne(() => Outlet, (outlet) => outlet.counters)
  @JoinColumn({ name: "sbu_id" })
  outlet: MasterSbu;
}
