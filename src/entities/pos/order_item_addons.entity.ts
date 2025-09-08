import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { OrderItem } from "./order_items.entity";

@Entity("pos_order_item_addons")
export class OrderItemAddon {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "int" })
  order_item_id: number;

  @ManyToOne(() => OrderItem, (item) => item.addons, { onDelete: "CASCADE" })
  @JoinColumn({ name: "order_item_id" })
  order_item: OrderItem;

  @Column({ type: "int" })
  addon_id: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  price: number;
}
