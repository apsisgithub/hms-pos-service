import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from "typeorm";
import { ReservationBillingDetails } from "src/entities/master/master-reservation-billing-info.entity";
import { MasterPayments } from "./master_payments.entity";
import { Reservation } from "./master_reservation.entity";

export enum PaymentModeType {
  Cash = "cash",
  Card = "card",
  Online = "online",
  Other = "other",
}

export enum PaymentModeStatus {
  Active = "Active",
  Inactive = "Inactive",
}

@Entity("master_payment_modes")
export class MasterPaymentMode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 255, nullable: false })
  name: string;

  @Column({
    type: "enum",
    enum: PaymentModeType,
    default: PaymentModeType.Cash,
    nullable: false,
  })
  type: PaymentModeType;

  @Column({
    type: "enum",
    enum: PaymentModeStatus,
    default: PaymentModeStatus.Active,
    nullable: false,
  })
  status: PaymentModeStatus;

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

  @OneToMany(() => Reservation, (reservation) => reservation.payment_mode)
  reservation: Reservation[];

  @OneToMany(() => ReservationBillingDetails, (billing) => billing.payment_mode)
  billingDetails: ReservationBillingDetails[];

  @OneToMany(() => MasterPayments, (payment) => payment.payment_mode)
  payments: MasterPayments[];
}
