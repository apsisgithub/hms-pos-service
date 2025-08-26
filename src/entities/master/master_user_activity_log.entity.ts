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
import { MasterSbu } from "src/entities/master/master_sbu.entity";
import { MasterUser } from "./master_user.entity";

export enum UserActivityLogStatus {
  Active = "Active",
  Inactive = "Inactive",
}

@Entity("master_user_activity_logs")
export class MasterUserActivityLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "int", nullable: true })
  sbu_id: number;

  @Column({ type: "int", nullable: true })
  user_id: number;

  @Column({ type: "varchar", length: 100, nullable: true })
  activity_type: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  module: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ type: "varchar", length: 45, nullable: true })
  ip_address: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  timestamp: Date; // Matches `created_at` in functionality, but kept due to schema

  @Column({
    type: "enum",
    enum: UserActivityLogStatus,
    default: UserActivityLogStatus.Active,
    nullable: false,
  })
  status: UserActivityLogStatus;

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
  @ManyToOne(() => MasterSbu, (sbu) => sbu.userActivityLogs)
  @JoinColumn({ name: "sbu_id" })
  sbu: MasterSbu;

  @ManyToOne(() => MasterUser, (user) => user.userActivityLogs)
  @JoinColumn({ name: "user_id" })
  user: MasterUser;
}
