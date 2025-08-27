import { CoreEntity } from "src/utils/core-entity";
import { Entity, Column } from "typeorm";

export enum CompanyStatus {
    ACTIVE = "Active",
    INACTIVE = "Inactive",
}

@Entity("master_companies")
export class Company extends CoreEntity {
    @Column({ type: "varchar", length: 255, nullable: false })
    register_name: string;

    @Column({ type: "int", nullable: false })
    sbu_id: number;

    @Column({ type: "varchar", length: 255, nullable: true })
    company_known_as: string;

    @Column({ type: "text", nullable: true })
    company_address: string;

    @Column({ type: "varchar", length: 50, nullable: true })
    company_phone_number: string;

    @Column({ type: "varchar", length: 50, nullable: true })
    fax: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    email: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    website: string;

    @Column({ type: "varchar", length: 100, unique: true, nullable: true })
    company_code: string;

    @Column({ type: "text", nullable: true })
    contact_person: string;

    @Column({ type: "int", nullable: true })
    credit_validity: number;

    @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
    current_outstanding: number;

    @Column({ type: "varchar", length: 100, nullable: true })
    over_limit_action: string;

    @Column({ type: "date", nullable: true })
    last_payment_date: Date;

    @Column({ type: "boolean", nullable: true })
    is_ledger_applied: boolean;

    @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
    credit_limit: number;

    @Column({ type: "varchar", length: 100, nullable: true })
    payment_term: string;

    @Column({
        type: "enum",
        nullable: false,
        default: CompanyStatus.ACTIVE,
        enum: CompanyStatus,
    })
    status: CompanyStatus;

    @Column({ type: "boolean", nullable: true })
    authorization_required: boolean;

    @Column({ type: "varchar", length: 255, nullable: true })
    approver_name: string;

    @Column({ type: "boolean", nullable: true })
    is_offer_applied: boolean;

    @Column({ type: "text", nullable: true })
    services: string;

    @Column({ type: "decimal", precision: 5, scale: 2, nullable: true })
    discount_percentage: number;
}
