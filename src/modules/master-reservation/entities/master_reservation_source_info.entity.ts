import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    OneToOne,
} from "typeorm";
import { CoreEntity } from "src/utils/core-entity";
import { Company } from "src/modules/master-companies/entities/master-companies.entity";
import { MasterBusinessAgent } from "src/modules/master-business-agents/entities/master-business-agent.entity";
import { Reservation } from "./master_reservation.entity";
import { UniqueSoftDelete } from "src/common/decorators/unique-sof-delete.decorator";

export enum SourceInfoStatus {
    ACTIVE = "Active",
    INACTIVE = "Inactive",
}

@UniqueSoftDelete(["reservation_id"], "composite_idx_reservation_id_status")
@Entity("reservation_source_info")
export class ReservationSourceInfo extends CoreEntity {
    @Column({ type: "int", nullable: true })
    reservation_id: number;

    @Column({ type: "int", nullable: true })
    market_code_id: number;

    @Column({
        type: "int",
        nullable: true,
    })
    business_source_id: number;

    @Column({ type: "int", nullable: true })
    travel_agent_id: number;

    @Column({ type: "varchar", length: 255, nullable: true })
    voucher_no: string;

    @Column({
        type: "varchar",
        nullable: true,
        length: 255,
    })
    commission_plan: string;

    @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
    plan_value: number;

    @Column({ type: "int", nullable: true })
    company_id: number;

    @Column({ type: "int", nullable: true })
    sales_person_id: number;

    @Column({
        type: "enum",
        enum: SourceInfoStatus,
        nullable: false,
        default: SourceInfoStatus.ACTIVE,
    })
    status: SourceInfoStatus;

    @ManyToOne(() => Company)
    @JoinColumn({ name: "company_id" })
    company: Company;

    @ManyToOne(() => Reservation)
    @JoinColumn({ name: "reservation_id" })
    reservation: Reservation;
}
