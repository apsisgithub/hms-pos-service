import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Order } from "./order.entity";

@Entity("pos_order_tokens")
export class OrderToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "int" })
  order_id: number;

  @ManyToOne(() => Order, (item) => item.tokens, { onDelete: "CASCADE" })
  @JoinColumn({ name: "order_item_id" })
  order: Order;

  @Column({ type: "int" })
  addon_id: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  price: number;
}
