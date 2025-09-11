import { Waiter } from "src/entities/pos/waiter.entity";
import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  OneToOne,
} from "typeorm";
import { MasterRole } from "src/entities/master/master_roles.entity";
import { MasterUserAccessibleSbu } from "./master_user_accessible_sbu.entity";
import { MasterUserActivityLog } from "./master_user_activity_log.entity";
import { CoreEntity } from "src/utils/core-entity";
import { UserPermission } from "./master_user_permission.entity";
import { PosCashier } from "../pos/cashier.entity";

export enum UserStatus {
  Active = "Active",
  Inactive = "Inactive",
}

export enum UserLanguage {
  Default = "Default",
  // Add other languages as needed
}

export enum CalendarLanguage {
  EnglishUK = "English/UK",
  // Add other calendar languages as needed
}

@Entity("master_users")
export class MasterUser extends CoreEntity {
  @Column({ type: "varchar", length: 255, nullable: false, unique: true })
  user_name: string;

  @Column({ type: "varchar", length: 255, nullable: false, unique: true })
  name: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  mobile_no: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  contact_no: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  alternative_contact_no: string;

  @Column({ type: "text", nullable: true })
  address: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  nationality: string;

  @Column({ type: "int", nullable: true })
  user_role_id: number;

  @Column({ type: "varchar", length: 100, nullable: true })
  designation: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  department: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  identification_number: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  identification_type: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  bank_name: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  branch_name: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  salary_account_no: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  mfs_no: string;

  @Column({
    type: "enum",
    enum: CalendarLanguage,
    default: CalendarLanguage.EnglishUK,
  })
  calendar_language: CalendarLanguage;

  @Column({ type: "enum", enum: UserLanguage, default: UserLanguage.Default })
  language: UserLanguage;

  @Column({ type: "int", nullable: true, default: 4 })
  show_last_credit_card_digits: number;

  @Column({ type: "varchar", length: 255, nullable: false, unique: true })
  email: string;

  @Column({ type: "varchar", length: 255, nullable: false })
  password: string;

  @Column({ type: "text", nullable: true })
  cv_attachment_url: string;

  @Column({ type: "text", nullable: true })
  profile_picture_url: string;

  @Column({
    type: "enum",
    enum: UserStatus,
    default: UserStatus.Active, // Set default to Active
  })
  status: UserStatus;
  // Relationships
  @ManyToOne(() => MasterRole, (role) => role.users)
  @JoinColumn({ name: "user_role_id" })
  role: MasterRole;

  @OneToMany(() => MasterUserAccessibleSbu, "user")
  userAccessibleSbu: MasterUserAccessibleSbu[];

  @OneToMany(() => MasterUserActivityLog, (log) => log.user)
  userActivityLogs: MasterUserActivityLog[];

  @OneToMany(() => UserPermission, (userPermission) => userPermission.user)
  permissions: UserPermission[];

  @OneToOne(() => Waiter, (waiter) => waiter.profile)
  waiter: Waiter;

  @OneToOne(() => PosCashier, (cashier) => cashier.profile)
  cashier: PosCashier;
}
