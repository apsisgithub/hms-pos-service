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
import { MasterRole } from "src/entities/master/master_roles.entity";
import { CoreEntity } from "src/utils/core-entity";

export enum RolePermissionStatus {
  Active = "Active",
  Inactive = "Inactive",
}

@Entity("master_role_permissions")
export class MasterRolePermission extends CoreEntity {
  @Column({ type: "int", nullable: false })
  role_id: number;

  @Column({ type: "int", nullable: true })
  permission_module_id: number;

  @Column({ type: "json", nullable: true })
  permission_actions_id: number[]; // Stored as JSON array in DB, mapped as number[] in TS

  @Column({
    type: "enum",
    enum: RolePermissionStatus,
    default: RolePermissionStatus.Active,
    nullable: false,
  })
  status: RolePermissionStatus;

  @ManyToOne(() => MasterRole, (role) => role.rolePermissions)
  @JoinColumn({ name: "role_id" })
  role: MasterRole;

  // @ManyToOne(
  //     () => MasterPermissionModules,
  //     (module) => module.rolePermissions
  // )
  // @JoinColumn({ name: "permission_module_id" })
  // permissionModule: MasterPermissionModules;
}
