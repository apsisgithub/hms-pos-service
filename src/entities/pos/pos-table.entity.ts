import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { CoreEntity } from "src/utils/core-entity";
import { PosOutlet } from "./pos-outlet.entity";

export enum TableStatus {
    Available = "Available",
    Occupied = "Occupied",
    Hold = "Hold",
}

@Entity("pos_tables")
export class PosTable extends CoreEntity {
    @Column({ type: "int" })
    outlet_id: number;

    @Column({ type: "varchar", length: 100 })
    table_name: string;

    @Column({ type: "varchar", length: 50 })
    table_short_code: string;

    @Column({ type: "int" })
    capacity: number;

    @Column({ type: "enum", enum: TableStatus, default: TableStatus.Available })
    status: TableStatus;

    @Column({ type: "text", nullable: true })
    remarks: string;

    @ManyToOne(() => PosOutlet, (outlet) => outlet.tables)
    @JoinColumn({ name: "outlet_id" })
    outlet: PosOutlet;
}
