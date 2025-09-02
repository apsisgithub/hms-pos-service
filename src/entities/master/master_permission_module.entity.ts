import { UserPermission } from "src/entities/master/master_user_permission.entity";
import { CoreEntity } from "src/utils/core-entity";
import { Entity, Column, OneToMany } from "typeorm";

export enum PermissionModuleStatus {
  Active = "active", // Matches original enum values for existing 'status'
  Inactive = "inactive",
}

export enum PermissionModuleGeneralStatus {
  Active = "Active", // New enum for the consistent 'Active'/'Inactive'
  Inactive = "Inactive",
}

@Entity("master_permission_modules")
export class MasterPermissionModules extends CoreEntity {
  @Column({ type: "varchar", length: 255, nullable: false })
  name: string;

  @Column({ type: "int", nullable: true })
  parent_id: number;

  @Column({ type: "int", nullable: false })
  sbu_id: number;

  @Column({ type: "varchar", length: 255, nullable: true })
  menu_url: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({
    type: "enum",
    enum: PermissionModuleStatus,
    default: PermissionModuleStatus.Active,
  })
  status: PermissionModuleStatus;

  // @OneToMany(
  //     () => MasterRolePermission,
  //     (rolePermission) => rolePermission.permissionModule
  // )
  // rolePermissions: MasterRolePermission[];

  @OneToMany(
    () => UserPermission,
    (userPermission) => userPermission.permissionModule
  )
  userPermissions: UserPermission[];
}
