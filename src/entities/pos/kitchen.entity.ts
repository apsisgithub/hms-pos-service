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
import { KitchenType } from "src/modules/kitchen/enum/kitchen.enum";

@Entity("pos_kitchens")
export class Kitchen {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "int", default: 1 })
  sbu_id: number;

  @Column({ type: "uuid", unique: true })
  @Generated("uuid")
  uuid: string;

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

  // Optional link to Outlet
  @Column({ name: "outlet_id", type: "int", nullable: true })
  outlet_id: number | null;

  @Column({ type: "boolean", default: true })
  is_active: boolean;

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
