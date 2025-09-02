import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";

import { MasterPermissionModules } from "src/entities/master/master_permission_module.entity";
import { MasterUser } from "./master_user.entity";
import { CoreEntity } from "src/utils/core-entity";

@Entity("user_permissions")
export class UserPermission extends CoreEntity {
  @Column({ type: "int", nullable: false })
  user_id: number;

  @ManyToOne(() => MasterUser, (user) => user.permissions)
  @JoinColumn({ name: "user_id" })
  user: MasterUser;

  @Column({ type: "int", nullable: false })
  permission_module_id: number;

  @ManyToOne(() => MasterPermissionModules, (module) => module.userPermissions) // Assuming 'userPermissions' on your module entity
  @JoinColumn({ name: "permission_module_id" })
  permissionModule: MasterPermissionModules;

  @Column({ type: "json", nullable: true })
  permission_actions_id: number[];
}
