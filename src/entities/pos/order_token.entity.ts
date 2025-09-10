import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { Order } from "./order.entity";
import { OrderItem } from "./order_items.entity";

export enum TokenType {
  KOT = "KOT",
  BILL = "BILL",
}

export enum TokenStatus {
  NEW = "NEW",
  PRINTED = "PRINTED",
  SERVED = "SERVED",
  CANCELLED = "CANCELLED",
}

@Entity("pos_order_tokens")
export class OrderToken {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id: number;

  @Column({ type: "bigint" })
  order_id: number;

  @Column({ type: "varchar", length: 20 })
  token_number: string; // e.g. T001, T002

  @Column({ type: "enum", enum: TokenType, default: TokenType.KOT })
  type: TokenType;

  @Column({ type: "int", default: 0 })
  print_count: number;

  @Column({ type: "timestamp", nullable: true })
  printed_at: Date;

  @Column({ type: "timestamp", nullable: true })
  served_at: Date;

  @Column({
    type: "enum",
    enum: TokenStatus,
    default: TokenStatus.NEW,
  })
  status: TokenStatus;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  created_at: Date;

  @Column({ type: "int", nullable: true })
  created_by: number;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updated_at: Date;

  @Column({ type: "int", nullable: true })
  updated_by: number;

  //relations
  @OneToMany(() => OrderItem, (item) => item.kot, { cascade: true })
  items: OrderItem[];

  @ManyToOne(() => Order, (order) => order.tokens, { onDelete: "CASCADE" })
  @JoinColumn({ name: "order_id" })
  order: Order;
}
