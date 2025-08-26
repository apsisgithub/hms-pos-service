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
import { CoreEntity } from "src/utils/core-entity";

export enum TaxType {
  Percentage = "percentage",
  Fixed = "fixed",
}

export enum TaxApplyTime {
  DuringCheckout = "During checkout",
  Other = "Other",
}

export enum TaxStatus {
  Active = "Active",
  Inactive = "Inactive",
}

@Entity("master_taxes")
export class MasterTax extends CoreEntity {
  @Column({ type: "int", nullable: false })
  sbu_id: number;

  @Column({ type: "varchar", length: 20, nullable: false, unique: true })
  short_name: string;

  @Column({ type: "varchar", length: 100, nullable: false })
  name: string;

  @Column({ type: "date", nullable: false })
  applies_from: Date;

  @Column({ type: "int", nullable: true }) // Nullable as not all taxes might have this exemption
  exempt_after_days: number;

  @Column({ type: "enum", enum: TaxType, nullable: false })
  tax_type: TaxType;

  @Column({ type: "enum", enum: TaxApplyTime, nullable: false })
  apply_tax: TaxApplyTime;

  @Column({ type: "boolean", default: false, nullable: false })
  apply_on_rack_rate: boolean;

  @Column({ type: "text", nullable: true })
  note: string;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  apply_after_amount: number;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: false })
  tax_rate: number; // For percentage: 10.50 (means 10.5%), For fixed: 100.00 (means $100)

  @Column({
    type: "enum",
    enum: TaxStatus,
    default: TaxStatus.Active,
    nullable: false,
  })
  status: TaxStatus;
  // Relationships (assuming MasterSbu still exists and is related)
  @ManyToOne(() => MasterSbu, (sbu) => sbu.taxes)
  @JoinColumn({ name: "sbu_id" })
  sbu: MasterSbu;
}
