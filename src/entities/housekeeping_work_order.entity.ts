import { Entity, Column, OneToMany } from "typeorm";
import { CoreEntity } from "src/utils/core-entity";
import { HousekeepingWorkOrderLog } from "./housekeeping_work_order_log.entity";

export enum WorkOrderCategory {
    Clean = "clean",
    Maintenance = "maintenance", 
    Repair = "repair",
    Other = "other"
}

export enum WorkOrderPriority {
    High = "high",
    Medium = "medium",
    Low = "low"
}

export enum WorkOrderStatus {
    New = "new",
    Assigned = "assigned",
    InProgress = "in_progress", 
    Completed = "completed"
}

@Entity("housekeeping_work_order")
export class HousekeepingWorkOrder extends CoreEntity {
    @Column({ type: "int", nullable: false })
    room_id: number;

    @Column({ type: "text", nullable: false })
    description: string;

    @Column({
        type: "enum",
        enum: WorkOrderCategory,
        enumName: "work_order_category",
        nullable: false
    })
    category: WorkOrderCategory;

    @Column({
        type: "enum", 
        enum: WorkOrderPriority,
        enumName: "work_order_priority",
        nullable: false
    })
    priority: WorkOrderPriority;

    @Column({
        type: "enum",
        enum: WorkOrderStatus,
        enumName: "work_order_status",
        default: WorkOrderStatus.New,
        nullable: false
    })
    status: WorkOrderStatus;

    @Column({ type: "int", nullable: false })
    assign_to: number;

    @Column({ type: "date", nullable: false })
    start_date: string;

    @Column({ type: "date", nullable: false })
    end_date: string;

    @Column({ type: "text", nullable: true })
    remark: string;

    // Relationships
    @OneToMany(() => HousekeepingWorkOrderLog, (log) => log.workOrder)
    logs: HousekeepingWorkOrderLog[];
}