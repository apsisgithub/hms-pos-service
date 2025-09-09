import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { MasterSbu } from "../master/master_sbu.entity";
import { Outlet } from "./outlet.entity";

@Entity("pos_counters")
export class PosCounter {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  // MySQL: default UUID() at DB level — let DB generate if omitted
  @ApiProperty()
  @Column({ type: "char", length: 36, unique: true, default: () => "UUID()" })
  uuid: string;

  @ApiProperty()
  @Column({ type: "int" })
  sbu_id: number;

  @ApiProperty()
  @Column({ type: "int" })
  outlet_id: number;

  @ApiProperty()
  @Column({ type: "varchar", length: 255 })
  name: string;

  @ApiProperty({ required: false, nullable: true })
  @Column({ type: "varchar", length: 255, nullable: true })
  location?: string;

  @ApiProperty({ required: false, nullable: true })
  @Column({ type: "text", nullable: true })
  description?: string;

  @ApiProperty()
  @CreateDateColumn({ type: "datetime", precision: 6 })
  created_at: Date;

  @ApiProperty()
  @UpdateDateColumn({ type: "datetime", precision: 6 })
  updated_at: Date;

  @ApiProperty({ required: false, nullable: true })
  @DeleteDateColumn({ type: "datetime", precision: 6, nullable: true })
  deleted_at?: Date | null;

  @ApiProperty({ required: false, nullable: true })
  @Column({ type: "int", nullable: true })
  created_by?: number | null;

  @ApiProperty({ required: false, nullable: true })
  @Column({ type: "int", nullable: true })
  updated_by?: number | null;

  @ApiProperty({ required: false, nullable: true })
  @Column({ type: "int", nullable: true })
  deleted_by?: number | null;

  // Optional relations (not required, but nice to have)
  @ManyToOne(() => MasterSbu, (s) => (s as any).counters, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: "sbu_id" })
  sbu?: MasterSbu;

  @ManyToOne(() => Outlet, (o) => (o as any).counters, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: "outlet_id" })
  outlet?: Outlet;
}
