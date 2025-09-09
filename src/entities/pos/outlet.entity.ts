import {
  Entity,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  Generated,
} from "typeorm";
import { Waiter } from "./waiter.entity";
import { PosTable } from "./table.entity";
import { MasterSbu } from "../master/master_sbu.entity";
import { PosCounter } from "./counter.entity";
import { Product } from "./products.entity";

@Entity("pos_outlets")
export class Outlet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "uuid", unique: true })
  @Generated("uuid")
  uuid: string;

  @Column({ type: "int" })
  sbu_id: number;

  @Column({ type: "varchar", length: 255 })
  name: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  logo: string;

  @Column({ type: "varchar", length: 155, nullable: true })
  email: string;

  @Column({ type: "varchar", length: 55, nullable: true })
  phone: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  location: string;

  @Column({ type: "text", nullable: true })
  description: string;

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

  @OneToMany(() => PosTable, (table) => table.outlet)
  tables: PosTable[];

  @OneToMany(() => Waiter, (waiter) => waiter.outlet)
  waiters: Waiter[];

  @ManyToOne(() => MasterSbu, (sbu) => sbu.outlets)
  @JoinColumn({ name: "sbu_id" })
  sbu: MasterSbu;

  @OneToMany(() => PosCounter, (counter) => counter.outlet)
  counters: PosCounter[];

  @OneToMany(() => Product, (product) => product.sbu)
  products: Product[];
}
