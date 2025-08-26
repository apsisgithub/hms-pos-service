import { Entity, Column } from "typeorm";
import { CoreEntity } from "src/utils/core-entity";

@Entity("audit_logs")
export class AuditLog extends CoreEntity {
    @Column({ type: "int", nullable: false })
    reservation_id: number;

    @Column({ type: "int", nullable: false })
    sbu_id: number;

    @Column({ type: "varchar", length: 255, nullable: true })
    prev_title: string;

    @Column({ type: "text", nullable: true })
    prev_description: string;

    @Column({ type: "varchar", length: 255, nullable: false })
    after_title: string;

    @Column({ type: "text", nullable: true })
    after_description: string;

    @Column({ type: "varchar", length: 45, nullable: true })
    ip_address: string;

    @Column({ type: "varchar", length: 100, nullable: true })
    operation_type: string;
}