import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { OrderItem } from "./order_items.entity";
import { MasterRoom } from "../master/master_room.entity";
import { MasterGuest } from "../master/master-guest.entity";
import { Waiter } from "./waiter.entity";
import { OrderToken } from "./order_token.entity";
import { Outlet } from "./outlet.entity";
import { PosTable } from "./table.entity";

export enum OrderStatus {
  PENDING = "Pending",
  IN_PROGRESS = "In-Progress",
  READY = "Ready",
  SERVED = "Served",
  COMPLETED = "Completed",
  CANCELLED = "Cancelled",
  HOLD = "Hold",
}

export enum OrderType {
  DINE_IN = "Dine-in",
  TAKE_AWAY = "Take Away",
  PICKUP = "Pick-up",
  ROOM_SERVICE = "Room Service",
  ADVANCE_BOOKING = "Advance Booking",
}

@Entity("pos_orders")
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "uuid", unique: true })
  @Generated("uuid")
  uuid: string;

  @Column({ type: "int", nullable: false })
  outlet_id?: number;

  @ManyToOne(() => Outlet, (item) => item.orders, { onDelete: "CASCADE" })
  @JoinColumn({ name: "order_item_id" })
  outlet: Outlet;

  @Column({ type: "varchar", length: 50, unique: true })
  order_no: string; // e.g. ORD-20250907-001

  @Column({ type: "enum", enum: OrderType, default: OrderType.DINE_IN })
  order_type: OrderType;

  @Column({ type: "int", nullable: true })
  table_id?: number | null; // if dine-in

  @ManyToOne(() => PosTable, (table) => table.orders, { onDelete: "CASCADE" })
  @JoinColumn({ name: "table_id" })
  posTable: PosTable;

  @Column({ type: "int", nullable: true })
  waiter_id?: number | null;

  // relationships with Waiter when dine-in or room-service
  @ManyToOne(() => Waiter, { onDelete: "SET NULL", eager: true })
  @JoinColumn({ name: "waiter_id" })
  waiter?: Waiter;

  @Column({ type: "int", nullable: true })
  guest_count: number | null; // if dine-in, number of guests at the table

  @Column({ type: "int", nullable: true })
  room_id?: number | null; // if room-service

  // relationships with MasterRoom
  @ManyToOne(() => MasterRoom, { onDelete: "SET NULL", eager: true })
  @JoinColumn({ name: "room_id" })
  room?: MasterRoom;

  @Column({ type: "int", nullable: true })
  customer_id?: number | null;

  // relationships with MasterGuest
  @ManyToOne(() => MasterGuest, { onDelete: "SET NULL", eager: true })
  @JoinColumn({ name: "customer_id" })
  customer?: MasterGuest;

  @Column({ type: "varchar", length: 255, nullable: true })
  customer_preference: string | null;

  @Column({ type: "varchar", length: 255, nullable: true })
  internal_note: string | null;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  subtotal: number;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  tax: number;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  service_charge: number;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  discount: number;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  grand_total: number;

  @Column({ type: "enum", enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  created_at: Date;

  @Column({ type: "int", nullable: true })
  created_by: number;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updated_at: Date;

  @Column({ type: "int", nullable: true })
  updated_by: number;

  @DeleteDateColumn({ name: "deleted_at", type: "timestamp" })
  deleted_at: Date | null;

  @Column({ type: "int", nullable: true })
  deleted_by: number | null;

  //relation with order items
  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
  items: OrderItem[];

  @OneToMany(() => OrderToken, (item) => item.order, { cascade: true })
  tokens: OrderToken[];
}
