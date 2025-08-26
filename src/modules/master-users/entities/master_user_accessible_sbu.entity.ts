// src/modules/master-user-accessible-sbu/entities/master_user_accessible_sbu.entity.ts
import {
    Entity,
    PrimaryColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
} from "typeorm";
import { MasterUser } from "./master_user.entity"; // Adjust this path if necessary
import { MasterSbu } from "src/modules/master-sbu/entities/master_sbu.entity"; // Adjust this path if necessary

export enum UserAccessibleSbuStatus {
    Active = "Active",
    Inactive = "Inactive",
}

@Entity("master_user_accessible_hotels") // Note: The table name is 'master_user_accessible_hotels'
export class MasterUserAccessibleSbu {
    @PrimaryColumn({ type: "int", nullable: false })
    user_id: number;

    @PrimaryColumn({ type: "int", nullable: false })
    sbu_id: number;

    @Column({
        type: "enum",
        enum: UserAccessibleSbuStatus,
        default: UserAccessibleSbuStatus.Active,
        nullable: false,
    })
    status: UserAccessibleSbuStatus;

    @CreateDateColumn({ type: "timestamp" })
    created_at: Date;

    @Column({ type: "int", nullable: true })
    created_by: number;

    @UpdateDateColumn({ type: "timestamp" })
    updated_at: Date;

    @Column({ type: "int", nullable: true })
    updated_by: number;

    @DeleteDateColumn({ type: "timestamp", nullable: true }) // Added nullable: true as is common for soft deletes
    deleted_at: Date;

    @Column({ type: "int", nullable: true })
    deleted_by: number;

    // Relationships - These remain as they are, referencing the properties on MasterUser and MasterSbu
    @ManyToOne(() => MasterUser, (user) => user.userAccessibleSbu)
    @JoinColumn({ name: "user_id" })
    user: MasterUser;

    @ManyToOne(() => MasterSbu, (sbu) => sbu.userAccessibleHotels)
    @JoinColumn({ name: "sbu_id" })
    sbu: MasterSbu;
}
