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

export enum DepartmentStatus {
    Active = "Active",
    Inactive = "Inactive",
}

@Entity("master_departments")
export class MasterDepartment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "int", nullable: false })
    sbu_id: number;

    @Column({ type: "varchar", length: 255, nullable: false })
    name: string;

    @Column({ type: "text", nullable: true })
    description: string;

    @Column({ type: "json", nullable: true })
    menu_access: object;

    @Column({
        type: "enum",
        enum: DepartmentStatus,
        default: DepartmentStatus.Active,
        nullable: false,
    })
    status: DepartmentStatus;

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
    @ManyToOne(() => MasterSbu, (sbu) => sbu.departments)
    @JoinColumn({ name: "sbu_id" })
    sbu: MasterSbu;
}
