import { CoreEntity } from "src/utils/core-entity";
import { Entity, Column } from "typeorm";

export enum PermissionActionStatus {
    Active = "Active",
    Inactive = "Inactive",
}

@Entity("master_permission_actions")
export class MasterPermissionAction extends CoreEntity {
    @Column({ type: "varchar", length: 100, unique: true, nullable: false })
    name: string;

    @Column({
        type: "enum",
        enum: PermissionActionStatus,
        default: PermissionActionStatus.Active,
        nullable: false,
    })
    status: PermissionActionStatus;
}
