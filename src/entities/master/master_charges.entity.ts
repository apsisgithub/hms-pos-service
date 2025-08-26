import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { CoreEntity } from "src/utils/core-entity";
import { Reservation } from "./master_reservation.entity";
import { MasterRoom } from "src/entities/master/master_room.entity";
import { MasterSbu } from "src/entities/master/master_sbu.entity";
import { MasterFolios } from "./master_folios.entity";

export enum ChargeType {
  ROOM_CHARGES = "RoomCharges",
  AIRPORT_PICKUP = "AirportPickup",
  BREAKFAST_WITH_LUNCH_OR_DINNER = "BreakfastWithLunchOrDinner",
  DAMAGE = "Damage",
  BALANCE_TRANSFER = "BalanceTransfer",
}

export enum PostingType {
  CHECK_IN_AND_CHECK_OUT = "CheckInAndCheckOut",
  EVERY_DAY = "EveryDay",
  EVERY_DAY_EXCEPT_CHECK_IN = "EveryDayExceptCheckIn",
  EVERY_DAY_EXCEPT_CHECK_IN_AND_CHECK_OUT = "EveryDayExceptCheckInAndCheckOut",
  EVERY_DAY_EXCEPT_CHECK_OUT = "EveryDayExceptCheckOut",
  CUSTOM_DATE = "CustomDate",
  CHECK_OUT = "CheckOut",
}

export enum ChargeRule {
  PER_ADULT = "PerAdult",
  PER_BOOKING = "PerBooking",
  PER_CHILD = "PerChild",
  PER_PERSON = "PerPerson",
  PER_QUANTITY = "PerQuanity",
}

export enum ChargeSubType {
  LATE_CHECKOUT_CHARGES = "Late Checkout Charges",
  CANCELLATION_REVENUE = "Cancellation Revenue",
  DAY_USE_CHARGES = "Day Use Charges",
  NO_SHOW_REVENUE = "No Show Revenue",
  ROOM_CHARGES = "Room Charges",
}

@Entity("master_charges")
export class MasterCharges extends CoreEntity {
  @Column({ type: "int", nullable: false })
  sbu_id: number;

  @Column({ type: "int", nullable: true })
  folio_id: number;

  @Column({ type: "int", nullable: true })
  ref_no: number;

  @Column({ type: "decimal", precision: 12, scale: 2, nullable: false })
  amount: number;

  @Column({ type: "varchar", length: 255, nullable: false })
  description: string;

  @Column({ type: "date", nullable: false })
  charge_date: Date;

  @Column({
    type: "enum",
    enum: ChargeType,
    nullable: false,
  })
  type: ChargeType;

  @Column({
    type: "enum",
    enum: ChargeSubType,
    nullable: true,
  })
  sub_type: ChargeSubType;

  @Column({
    type: "enum",
    enum: PostingType,
    nullable: true,
  })
  posting_type: PostingType;

  @Column({
    type: "enum",
    enum: ChargeRule,
    nullable: true,
  })
  charge_rule: ChargeRule;

  @Column({ type: "boolean", default: false })
  is_tax_included: boolean;

  // Relationships
  @ManyToOne(() => MasterSbu, (sbu) => sbu.charges)
  @JoinColumn({ name: "sbu_id" })
  sbu: MasterSbu;

  @ManyToOne(() => MasterFolios, (folio) => folio.charges)
  @JoinColumn({ name: "folio_id" })
  folio: MasterFolios;
}
