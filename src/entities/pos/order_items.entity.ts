import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Order } from "./order.entity";
import { OrderItemAddon } from "./order_item_addons.entity";
import { OrderToken } from "./order_token.entity";

export enum ItemStatus {
  PENDING = "Pending",
  PREPARING = "Preparing",
  COMPLETED = "Completed",
  SERVED = "Served",
  CANCELLED = "Cancelled",
  HOLD = "Hold",
}

export enum DiscountType {
  FIXED = "Fixed",
  PERCENTAGE = "Percentage",
}

@Entity("pos_order_items")
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "int" })
  order_id: number;

  @Column({ type: "int" })
  product_id: number;

  @Column({ type: "int", nullable: true })
  variant_id: number | null;

  @Column({ type: "int", nullable: true })
  token_id: number | null;

  @Column({ type: "int", default: 1 })
  quantity: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  unit_price: number; // price of product/variant

  @Column({
    type: "enum",
    enum: DiscountType,
  })
  discount_type: DiscountType | null;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  discount: number | null;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  subtotal: number; // (unit_price  * quantity)  + addons - discount

  @Column({ type: "varchar", length: 20 })
  remarks: string | null;

  @Column({ type: "timestamp", nullable: true })
  prepared_at: Date;

  @Column({ type: "timestamp", nullable: true })
  served_at: Date;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  created_at: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updated_at: Date;

  @Column({
    type: "enum",
    enum: ItemStatus,
    default: ItemStatus.PENDING,
  })
  status: string;

  //relations
  @ManyToOne(() => Order, (order) => order.items, { onDelete: "CASCADE" })
  @JoinColumn({ name: "order_id" })
  order: Order;

  @ManyToOne(() => OrderToken, (token) => token.items, { onDelete: "CASCADE" })
  @JoinColumn({ name: "token_id" })
  kot: Order;

  @OneToMany(() => OrderItemAddon, (addon) => addon.orderItem, {
    cascade: true,
  })
  addons: OrderItemAddon[];
}
