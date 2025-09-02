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
} from "typeorm";
import { MasterSbu } from "src/entities/master/master_sbu.entity";
import { CoreEntity } from "src/utils/core-entity";
import { UniqueSoftDelete } from "src/common/decorators/unique-sof-delete.decorator";
import { Reservation } from "./master_reservation.entity";

export enum AgentStatus {
  Active = "Active",
  Inactive = "Inactive",
}

@Entity("master_business_agents")
@UniqueSoftDelete(
  ["name", "short_code", "sbu_id"],
  "composite_idx_name_short_code"
)
export class MasterBusinessAgent extends CoreEntity {
  @Column()
  sbu_id: number;

  @Column({ type: "varchar", length: 255, nullable: false })
  name: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  short_code: string;

  @Column({ type: "varchar", length: 20, nullable: true })
  color: string;

  @Column({ type: "text", nullable: true })
  commission: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  bin_number: string;

  @Column({ type: "text", nullable: true })
  address: string;

  @Column({
    type: "enum",
    enum: AgentStatus,
    default: AgentStatus.Active,
    nullable: false,
  })
  status: AgentStatus;

  @OneToMany(() => Reservation, (reservation) => reservation.businessAgent)
  reservations: Reservation[];

  @ManyToOne(() => MasterSbu, (sbu) => sbu.businessAgents)
  @JoinColumn({ name: "sbu_id" })
  sbu: MasterSbu;
}
