import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";

import { Reservation } from "src/entities/master/master_reservation.entity";
import { MasterGuest } from "src/entities/master/master-guest.entity";
import { MasterPaymentMode } from "src/entities/master/master_payment_modes.entity"; // <-- Add this
import { CoreEntity } from "src/utils/core-entity";
import { MasterEmailTemplate } from "src/entities/master/master_email_templates.entity";

export enum BillingType {
  CASH_BANK = "Cash/Bank",
  CITY_LEDGER = "City Ledger",
}

export enum ReservationBookingType {
  CONFIRM_BOOKING = "Confirm Booking",
  HOLD_CONFIRM_BOOKING = "Hold Confirm Booking",
  HOLD_UNCONFIRM_BOOKING = "Hold Unconfirm Booking",
  ONLINE_FAILED_BOOKING = "Online Failed Booking",
  RELEASED = "Released",
  UNCONFIRMED_BOOKING_INQUIRY = "Unconfirmed Booking Inquiry",
}

export enum CommissionPlan {
  COFRIRM_BOOKING = "Confirm Booking",
  NON_REFUNDABLE = "Non Refundable",
  CORPORATE = "Corporate",
}

@Entity("master_reservation_billing_details")
export class ReservationBillingDetails extends CoreEntity {
  @Column({ type: "int", nullable: false })
  reservation_id: number;

  @Column({
    type: "enum",
    enum: BillingType,
    nullable: false,
    default: BillingType.CASH_BANK,
  })
  billing_type: BillingType;

  @Column({ type: "int", nullable: false })
  payment_mode_id: number;

  @Column({ type: "varchar", length: 100, nullable: true })
  registration_no: string;

  @Column({
    type: "enum",
    enum: ReservationBookingType,
    default: ReservationBookingType.HOLD_CONFIRM_BOOKING,
    name: "reservation_type",
  })
  reservation_type: ReservationBookingType;

  @Column({ type: "int", nullable: true })
  rate_plan_package_id: number;

  @Column({ type: "int", nullable: true })
  guest_id: number;

  @Column({ type: "text", nullable: true })
  rate_plan_package_details: string;

  @Column({ type: "boolean", nullable: false, default: false })
  send_checkout_email: boolean;

  @Column({ type: "int", nullable: true })
  checkout_email_template_id: number;

  @Column({ type: "boolean", nullable: false, default: false })
  suppress_rate_on_gr_card: boolean;

  @Column({ type: "boolean", nullable: false, default: false })
  display_inclusion_separately_on_folio: boolean;

  @Column({ type: "boolean", nullable: false, default: false })
  apply_to_group: boolean;

  @Column({ type: "int", nullable: true })
  market_code_id: number;

  @Column({ type: "int", nullable: true })
  business_source_id: number;

  @Column({ type: "int", nullable: true })
  travel_agent_id: number;

  @Column({ type: "varchar", length: 20, nullable: true })
  voucher_no: string;

  @Column({
    type: "enum",
    enum: CommissionPlan,
    nullable: true,
    default: CommissionPlan.COFRIRM_BOOKING,
  })
  commission_plan: CommissionPlan;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  plan_value: number;

  @Column({ type: "int", nullable: true })
  company_id: number;

  @Column({ type: "int", nullable: true })
  sales_person_id: number;

  @ManyToOne(() => Reservation, (reservation) => reservation.billingDetails)
  @JoinColumn({ name: "reservation_id" })
  reservation: Reservation;

  @ManyToOne(() => MasterGuest, (guest) => guest.billingDetails)
  @JoinColumn({ name: "guest_id" })
  guest: MasterGuest;

  @ManyToOne(() => MasterPaymentMode, (mode) => mode.billingDetails)
  @JoinColumn({ name: "payment_mode_id" })
  payment_mode: MasterPaymentMode;

  @ManyToOne(() => MasterEmailTemplate)
  @JoinColumn({ name: "checkout_email_template_id" })
  checkout_email_template: MasterEmailTemplate;
}
