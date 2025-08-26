import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    OneToMany,
} from "typeorm";
import { MasterSbu } from "src/modules/master-sbu/entities/master_sbu.entity";
import { Reservation } from "src/modules/master-reservation/entities/master_reservation.entity";
import { UniqueSoftDelete } from "src/common/decorators/unique-sof-delete.decorator";

export enum BusinessSourceStatus {
    Active = "Active",
    Inactive = "Inactive",
}

@Entity("master_business_sources")
@UniqueSoftDelete(["name", "short_code", "sbu_id"], "composite_idx_name_code")
export class MasterBusinessSource {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "int", nullable: false })
    sbu_id: number;

    @Column({ type: "varchar", length: 255, nullable: false })
    name: string;

    @Column({ type: "varchar", length: 50, nullable: true })
    short_code: string;

    @Column({ type: "varchar", length: 50, nullable: true })
    market_code: string;

    @Column({ type: "varchar", length: 50, nullable: true })
    registration_no: string;

    @Column({ type: "text", nullable: true })
    address: string;

    @Column({ type: "varchar", length: 10, nullable: true })
    color_code: string;

    @Column({
        type: "enum",
        enum: BusinessSourceStatus,
        default: BusinessSourceStatus.Active,
        nullable: false,
    })
    status: BusinessSourceStatus;

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
    @ManyToOne(() => MasterSbu, (sbu) => sbu.businessSources)
    @JoinColumn({ name: "sbu_id" })
    sbu: MasterSbu;

    @OneToMany(() => Reservation, (reservation) => reservation.businessSource)
    reservations: Reservation[];
}
