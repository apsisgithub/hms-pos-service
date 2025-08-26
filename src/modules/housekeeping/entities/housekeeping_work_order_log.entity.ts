import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { CoreEntity } from "src/utils/core-entity";
import { HousekeepingWorkOrder, WorkOrderStatus } from "./housekeeping_work_order.entity";

@Entity("housekeeping_work_order_log")
export class HousekeepingWorkOrderLog extends CoreEntity {
    @Column({ type: "int", nullable: false })
    work_order_id: number;

    @Column({
        type: "enum",
        enum: WorkOrderStatus,
        enumName: "work_order_status",
        nullable: false
    })
    status: WorkOrderStatus;

    @Column({ type: "int", nullable: true })
    assign_to: number;

    @Column({ type: "text", nullable: true })
    remark: string;

    // Relationships
    @ManyToOne(() => HousekeepingWorkOrder, (workOrder) => workOrder.logs)
    @JoinColumn({ name: "work_order_id" })
    workOrder: HousekeepingWorkOrder;
}