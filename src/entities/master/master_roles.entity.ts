import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from "typeorm";
import { MasterRolePermission } from "src/entities/master/master_role_permission.entity";
import { MasterSbu } from "src/entities/master/master_sbu.entity";
import { MasterUser } from "./master_user.entity";

export enum RoleName {
  SuperAdmin = "super_admin",
  Admin = "admin",
  Manager = "manager",
  Cashier = "cashier",
  Housekeeping = "housekeeping",
  FrontDesk = "front_desk",
  OtherStaff = "other_staff",
}

export enum RoleStatus {
  Active = "Active",
  Inactive = "Inactive",
}

@Entity("master_roles")
@Index("composition_idx_name", ["sbu_id", "name"], { unique: true })
export class MasterRole {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 100, nullable: false })
  name: string;

  @Column({ type: "int", nullable: false })
  sbu_id: number;

  @Column({
    type: "enum",
    enum: RoleStatus,
    default: RoleStatus.Active,
    nullable: false,
  })
  status: RoleStatus;

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
  @OneToMany(() => MasterUser, (user) => user.role)
  users: MasterUser[];

  // This is the correct inverse side property on MasterRole
  @OneToMany(() => MasterRolePermission, (permission) => permission.role)
  rolePermissions: MasterRolePermission[];

  @ManyToOne(() => MasterSbu, (sbu) => sbu.roles)
  @JoinColumn({ name: "sbu_id" })
  sbu: MasterSbu;
}
