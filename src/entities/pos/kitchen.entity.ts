import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Generated,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Outlet } from "./outlet.entity";
import { Product } from "./products.entity";
import {
  KitchenType,
  KitchenStatus,
} from "src/modules/kitchen/enum/kitchen.enum";

@Entity("pos_kitchens")
export class Kitchen {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "uuid", unique: true })
  @Generated("uuid")
  uuid: string;

  @Column({ type: "int", default: 1 })
  sbu_id: number;

  @Column({ name: "outlet_id", type: "int", nullable: true })
  outlet_id: number | null;

  @Column({ type: "varchar", length: 255 })
  name: string;

  @Column({ type: "varchar", length: 255 })
  location: string;

  @Column({
    type: "enum",
    enum: KitchenType,
    default: KitchenType.KITCHEN,
  })
  type: KitchenType;

  @Column({
    type: "enum",
    enum: KitchenStatus,
    default: KitchenStatus.ACTIVE,
  })
  status: KitchenStatus;

  // Kitchen open/close status
  @Column({ type: "boolean", default: true })
  is_open: boolean;

  // Optional: track when kitchen was last opened or closed
  @Column({ type: "timestamp", nullable: true })
  opened_at: Date | null;

  @Column({ type: "timestamp", nullable: true })
  closed_at: Date | null;

  // Printer configuration
  @Column({ type: "varchar", length: 255, nullable: true })
  printer_name: string | null;

  @Column({ type: "varchar", length: 255, nullable: true })
  printer_ip: string | null;

  @Column({ type: "int", nullable: true })
  printer_port: number | null;

  @Column({ type: "boolean", default: true })
  printer_enabled: boolean;

  @CreateDateColumn({ type: "timestamp" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at: Date;

  @DeleteDateColumn({ type: "timestamp", nullable: true })
  deleted_at?: Date | null;

  @Column({ type: "int", nullable: true })
  created_by: number | null;

  @Column({ type: "int", nullable: true })
  updated_by: number | null;

  @Column({ type: "int", nullable: true })
  deleted_by: number | null;

  // relationships with outlet
  @ManyToOne(() => Outlet, { onDelete: "SET NULL", eager: true })
  @JoinColumn({ name: "outlet_id" })
  outlet: Outlet;

  // relations with products
  @OneToMany(() => Product, (product) => product.kitchen)
  products: Product[];
}
