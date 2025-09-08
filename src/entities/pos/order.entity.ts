import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { OrderItem } from "./order_items.entity";

@Entity("pos_orders")
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 50, unique: true })
  order_no: string; // e.g. ORD-20250907-001

  @Column({ type: "int", nullable: true })
  table_id: number | null; // if dine-in

  @Column({ type: "int", nullable: true })
  customer_id: number | null;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  total_amount: number;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  discount: number;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  final_amount: number;

  @Column({ type: "varchar", length: 20, default: "pending" })
  status: "pending" | "served" | "paid" | "cancelled";

  @CreateDateColumn({ name: "created_at" })
  created_at: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updated_at: Date;

  //relation with order items
  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
  items: OrderItem[];
}
