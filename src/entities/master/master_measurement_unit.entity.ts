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

export enum MeasurementUnitStatus {
  Active = "Active",
  Inactive = "Inactive",
}

@Entity("master_measurement_units")
export class MasterMeasurementUnit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "int", nullable: false })
  sbu_id: number;

  @Column({ type: "varchar", length: 100, nullable: false })
  name: string;

  @Column({ type: "varchar", length: 10, nullable: true })
  abbreviation: string;

  @Column({ type: "boolean", default: true })
  is_active: boolean;

  @Column({
    type: "enum",
    enum: MeasurementUnitStatus,
    default: MeasurementUnitStatus.Active,
    nullable: false,
  })
  status: MeasurementUnitStatus;

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
  @ManyToOne(() => MasterSbu, (sbu) => sbu.measurementUnits)
  @JoinColumn({ name: "sbu_id" })
  sbu: MasterSbu;
}
