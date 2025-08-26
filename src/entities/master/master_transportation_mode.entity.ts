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

export enum TransportationModeStatus {
  Active = "Active",
  Inactive = "Inactive",
}

@Entity("master_transportation_modes")
export class MasterTransportationMode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "int", nullable: false })
  sbu_id: number;

  @Column({ type: "varchar", length: 255, nullable: false })
  name: string;

  @Column({ type: "varchar", length: 10, nullable: true })
  color_code: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({
    type: "enum",
    enum: TransportationModeStatus,
    default: TransportationModeStatus.Active,
    nullable: false,
  })
  status: TransportationModeStatus;

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
  @ManyToOne(() => MasterSbu, (sbu) => sbu.transportationModes)
  @JoinColumn({ name: "sbu_id" })
  sbu: MasterSbu;
}
