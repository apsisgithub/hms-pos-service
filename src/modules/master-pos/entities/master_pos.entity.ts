import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
} from "typeorm";
import { MasterSbu } from "src/modules/master-sbu/entities/master_sbu.entity";
import { MasterCurrency } from "src/modules/master-currencies/entities/master_currencies.entity";

export enum PosPointStatus {
    Active = "Active",
    Inactive = "Inactive",
}

@Entity("master_pos_points")
export class MasterPosPoint {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "int", nullable: false })
    sbu_id: number;

    @Column({ type: "varchar", length: 255, nullable: false })
    name: string;

    @Column({ type: "int", nullable: true })
    currency_id: number;

    @Column({ type: "boolean", default: true })
    vat_enabled: boolean;

    @Column({ type: "boolean", default: true })
    service_charge_enabled: boolean;

    @Column({ type: "varchar", length: 512, nullable: true })
    logo_url: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    email: string;

    @Column({
        type: "enum",
        enum: PosPointStatus,
        default: PosPointStatus.Active,
        nullable: false,
    })
    status: PosPointStatus;

    @CreateDateColumn({ type: "timestamp" })
    created_at: Date;

    @Column({ type: "int", nullable: true })
    created_by: number;

    @UpdateDateColumn({ type: "timestamp" })
    updated_at: Date;

    @Column({ type: "int", nullable: true })
    updated_by: number;

    @DeleteDateColumn({ type: "timestamp" })
    deleted_at: Date;

    @Column({ type: "int", nullable: true })
    deleted_by: number;

    // Relationships
    @ManyToOne(() => MasterSbu, (sbu) => sbu.posPoints)
    @JoinColumn({ name: "sbu_id" })
    sbu: MasterSbu;

    @ManyToOne(() => MasterCurrency, (currency) => currency.posPoints)
    @JoinColumn({ name: "currency_id" })
    currency: MasterCurrency;
}