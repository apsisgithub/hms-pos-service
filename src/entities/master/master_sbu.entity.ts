import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from "typeorm";
import { MasterBuilding } from "src/entities/master/master_building.entity";
import { MasterFloor } from "src/entities/master/master_floor.entity";
import { MasterRoomType } from "src/entities/master/master_room_types.entity";
import { MasterRoom } from "src/entities/master/master_room.entity";
import { MasterRateType } from "src/entities/master/master_rate_type.entity";
import { MasterSeason } from "src/entities/master/master_seasons.entity";
import { MasterRoomRate } from "src/entities/master/master_room_rates.entity";
import { MasterTax } from "src/entities/master/master_tax.entity";
import { MasterDisplaySetting } from "src/entities/master/master_display_settings.entity";
import { MasterCurrency } from "src/entities/master/master_currencies.entity";
import { MasterDiscount } from "src/entities/master/master_discount.entity";
import { MasterTransportationMode } from "src/entities/master/master_transportation_mode.entity";
import { MasterBusinessSource } from "src/entities/master/master_business_sources.entity";
import { MasterEmailTemplate } from "src/entities/master/master_email_templates.entity";
import { MasterDepartment } from "src/entities/master/master_departments.entity";
import { MasterPosPoint } from "src/entities/master/master_pos.entity";
import { MasterMeasurementUnit } from "src/entities/master/master_measurement_unit.entity";
import { MasterUserActivityLog } from "src/entities/master/master_user_activity_log.entity";
import { MasterUserAccessibleSbu } from "src/entities/master/master_user_accessible_sbu.entity";
import { MasterBusinessAgent } from "src/entities/master/master-business-agent.entity";
import { MasterGuest } from "src/entities/master/master-guest.entity";
import { Reservation } from "src/entities/master/master_reservation.entity";
import { MasterRole } from "src/entities/master/master_roles.entity";
import { MasterCreditCard } from "src/entities/master/master_credit_card.entity";
import { MasterPayments } from "src/entities/master/master_payments.entity";

import { UniqueSoftDelete } from "src/common/decorators/unique-sof-delete.decorator";
import { MasterFolios } from "src/entities/master/master_folios.entity";
import { MasterCharges } from "./master_charges.entity";
import { PosTable } from "../pos/table.entity";
import { PosWaiter } from "../pos/waiter.entity";
import { PosOutlet } from "../pos/outlet.entity";
import { PosCounter } from "../pos/counter.entity";

export enum MasterSbuStatus {
  Active = "Active",
  Inactive = "Inactive",
}

@Entity("master_sbu")
@UniqueSoftDelete(["name", "email"], "composite_idx_name")
export class MasterSbu {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 255, nullable: false })
  name: string;

  @Column({ type: "text", nullable: true, name: "address1" })
  address: string;

  @Column({ type: "varchar", length: 255, nullable: false })
  email: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  phone: string;

  // Added new fields based on the UI
  @Column({ type: "varchar", length: 50, nullable: true })
  hotline: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  fax: string;

  @Column({ type: "text", nullable: true })
  hotel_policy: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  website: string;

  // Changed logo_url to logo_name for consistency with file handling
  @Column({ type: "varchar", length: 512, nullable: true })
  logo_name: string;

  // New field for logo dimension
  @Column({ type: "varchar", length: 50, nullable: true })
  logo_dimension: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  grade: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  bin_number: string;

  // New fields for VAT and Tax rules
  @Column({ type: "varchar", length: 255, nullable: true })
  vat_software: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  tax_rule: string;

  // Existing currency code, but now explicitly shown in UI
  @Column({ type: "varchar", length: 10, default: "USD" })
  currency_code: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  country: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  city: string;

  // New fields for POS Outlets, Room Count, and Assign IP
  // Note: The POS Outlets field in the UI is a dropdown, which likely
  // corresponds to a relationship, but for now, a string column is
  // a placeholder. The room count is an integer.
  @Column({ type: "int", default: 0, nullable: false })
  rooms_count: number;

  @Column({ type: "varchar", length: 50, nullable: true })
  assign_ip: string;

  // You already had a relationship for posPoints, so this might be a link
  // to that table instead of a simple column. I'll add a placeholder column
  // for now, but you might want to consider a Many-to-Many relationship here.
  @Column({ type: "simple-array", nullable: true })
  pos_outlets: string[];

  @Column({ type: "varchar", length: 100, default: "Asia/Dhaka" })
  timezone: string;

  @Column({
    type: "enum",
    enum: MasterSbuStatus,
    default: MasterSbuStatus.Active,
    nullable: false,
  })
  status: MasterSbuStatus;

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

  // Relationships (no change)
  @OneToMany(() => MasterBuilding, (building) => building.sbu)
  buildings: MasterBuilding[];

  @OneToMany(() => MasterFloor, (floor) => floor.sbu)
  floors: MasterFloor[];

  @OneToMany(() => MasterRoomType, (roomType) => roomType.sbu)
  roomTypes: MasterRoomType[];

  @OneToMany(() => MasterRoom, (room) => room.sbu)
  rooms: MasterRoom[];

  @OneToMany(() => MasterRateType, (rateType) => rateType.sbu)
  rateTypes: MasterRateType[];

  @OneToMany(() => MasterSeason, (season) => season.sbu)
  seasons: MasterSeason[];

  @OneToMany(() => MasterRoomRate, (roomRate) => roomRate.sbu)
  roomRates: MasterRoomRate[];

  @OneToMany(() => MasterTax, (tax) => tax.sbu)
  taxes: MasterTax[];

  @OneToMany(() => MasterDisplaySetting, (setting) => setting.sbu)
  displaySettings: MasterDisplaySetting[];

  @OneToMany(() => MasterCurrency, (currency) => currency.sbu)
  currencies: MasterCurrency[];

  @OneToMany(() => MasterDiscount, (discount) => discount.sbu)
  discounts: MasterDiscount[];

  @OneToMany(() => MasterTransportationMode, (mode) => mode.sbu)
  transportationModes: MasterTransportationMode[];

  @OneToMany(() => MasterBusinessSource, (source) => source.sbu)
  businessSources: MasterBusinessSource[];

  @OneToMany(() => MasterEmailTemplate, (template) => template.sbu)
  emailTemplates: MasterEmailTemplate[];

  @OneToMany(() => MasterDepartment, (department) => department.sbu)
  departments: MasterDepartment[];

  @OneToMany(() => MasterPosPoint, (posPoint) => posPoint.sbu)
  posPoints: MasterPosPoint[];

  @OneToMany(() => MasterMeasurementUnit, (unit) => unit.sbu)
  measurementUnits: MasterMeasurementUnit[];

  @OneToMany(() => MasterUserActivityLog, (log) => log.sbu)
  userActivityLogs: MasterUserActivityLog[];

  @OneToMany(() => MasterUserAccessibleSbu, (uah) => uah.sbu)
  userAccessibleHotels: MasterUserAccessibleSbu[];

  @OneToMany(() => MasterBusinessAgent, (businessAgent) => businessAgent.sbu)
  businessAgents: MasterBusinessAgent[];

  @OneToMany(() => MasterGuest, (guest) => guest.sbu)
  guests: MasterGuest[];

  @OneToMany(() => Reservation, (reservation) => reservation.sbu)
  reservations: Reservation[];

  @OneToMany(() => MasterRole, (role) => role.sbu)
  roles: MasterRole[];

  @OneToMany(() => MasterCreditCard, (creditCard) => creditCard.sbu)
  creditCards: MasterCreditCard[];

  @OneToMany(() => MasterPayments, (payment) => payment.sbu)
  payments: MasterPayments[];

  @OneToMany(() => MasterCharges, (charge) => charge.sbu)
  charges: MasterCharges[];

  @OneToMany(() => MasterFolios, (folio) => folio.sbu)
  folios: MasterFolios[];

  //relation added for pos
  @OneToMany(() => PosTable, (table) => table.sbu)
  tables: PosTable[];

  @OneToMany(() => PosWaiter, (waiter) => waiter.sbu)
  waiters: PosWaiter[];

  @OneToMany(() => PosOutlet, (outlet) => outlet.sbu)
  outlets: PosOutlet[];

  @OneToMany(() => PosCounter, (counter) => counter.sbu)
  counters: PosCounter[];
}
