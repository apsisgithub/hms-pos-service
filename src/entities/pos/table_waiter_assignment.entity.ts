import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { CoreEntity } from "src/utils/core-entity";
import { PosTable } from "./table.entity";
import { PosWaiter } from "./waiter.entity";

export enum TableWaiterStatus {
  Active = "Active", // currently serving
  Released = "Released", // no longer serving
  Transferred = "Transferred", // moved responsibility to another waiter
}

@Entity("pos_table_waiter_assignments")
export class TableWaiterAssignment extends CoreEntity {
  @Column({ type: "int" })
  table_id: number;

  @ManyToOne(() => PosTable, (table) => table.id)
  @JoinColumn({ name: "table_id" })
  table: PosTable;

  @Column({ type: "int" })
  waiter_id: number;

  @ManyToOne(() => PosWaiter, (waiter) => waiter.id)
  @JoinColumn({ name: "waiter_id" })
  waiter: PosWaiter;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  assigned_at: Date;

  @Column({ type: "timestamp", nullable: true })
  unassigned_at: Date;

  @Column({
    type: "enum",
    enum: TableWaiterStatus,
    default: TableWaiterStatus.Active,
  })
  status: TableWaiterStatus;
}
