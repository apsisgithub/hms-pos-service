import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Order } from "./order.entity";
import { OrderItemAddon } from "./order_item_addons.entity";

@Entity("pos_order_items")
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "int" })
  order_id: number;

  @ManyToOne(() => Order, (order) => order.items, { onDelete: "CASCADE" })
  @JoinColumn({ name: "order_id" })
  order: Order;

  @Column({ type: "int" })
  product_id: number;

  @Column({ type: "int", nullable: true })
  variant_id: number | null;

  @Column({ type: "int", default: 1 })
  quantity: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  unit_price: number; // price of product/variant

  @Column({ type: "decimal", precision: 10, scale: 2 })
  subtotal: number; // (unit_price * quantity) + addons

  @OneToMany(() => OrderItemAddon, (addon) => addon.order_item, {
    cascade: true,
  })
  addons: OrderItemAddon[];
}
