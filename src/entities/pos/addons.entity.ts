import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Generated,
} from "typeorm";

@Entity("pos_addons")
export class Addon {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "uuid", unique: true })
  @Generated("uuid")
  uuid: string;

  @Column({ type: "varchar", length: 255 })
  name: string;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  price: number;

  @Column({ name: "is_active", type: "int", default: 0 })
  is_active: number;

  @CreateDateColumn({ name: "created_at" })
  created_at: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updated_at: Date;

  @DeleteDateColumn({ name: "deleted_at" })
  deleted_at: Date | null;

  @Column({ type: "int", nullable: true })
  created_by?: number;

  @Column({ type: "int", nullable: true })
  updated_by?: number;

  @Column({ type: "int", nullable: true })
  deleted_by?: number | null;
}
