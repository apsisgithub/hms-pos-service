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

export enum DiscountType {
  Percentage = "percentage",
  Fixed = "fixed",
}

export enum DiscountStatus {
  Active = "Active",
  Inactive = "Inactive",
}

@Entity("master_discounts")
export class MasterDiscount {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "int", nullable: false })
  sbu_id: number;

  @Column({ type: "varchar", length: 255, nullable: false })
  name: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  code: string;

  @Column({ type: "enum", enum: DiscountType, nullable: true })
  type: DiscountType;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  value: number;

  @Column({ type: "date", nullable: true })
  start_date: string; // Or Date type

  @Column({ type: "date", nullable: true })
  end_date: string; // Or Date type

  @Column({ type: "json", nullable: true })
  applies_to: object;

  @Column({ type: "boolean", default: true })
  is_active: boolean;

  @Column({
    type: "enum",
    enum: DiscountStatus,
    default: DiscountStatus.Active,
    nullable: false,
  })
  status: DiscountStatus;

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
  @ManyToOne(() => MasterSbu, (sbu) => sbu.discounts)
  @JoinColumn({ name: "sbu_id" })
  sbu: MasterSbu;
}
