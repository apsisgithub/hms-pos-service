import { Entity, Column, OneToOne, JoinColumn } from "typeorm";
import { MasterSbu } from "src/entities/master/master_sbu.entity";
import { CoreEntity } from "src/utils/core-entity";

export enum DisplaySettingStatus {
  Active = "Active",
  Inactive = "Inactive",
}

export enum IdentityType {
  NID = "NID",
  PASSPORT = "Passport",
  DRIVING_LICENSE = "Driving License",
  BIRTH_CERTIFICATE = "Birth Certificate",
  OTHER = "Other",
}

export enum SalutationType {
  MR = "Mr.",
  MS = "Ms.",
  MRS = "Mrs.",
  DR = "Dr.",
}

export enum DateFormat {
  DD_MM_YYYY = "DD-MM-YYYY",
  MM_DD_YYYY = "MM-DD-YYYY",
  YYYY_MM_DD = "YYYY-MM-DD",
  DD_MMM_YYYY = "DD-MMM-YYYY",
}

export enum TimeFormat {
  HH_MM_24 = "HH:mm", // 24-hour
  HH_MM_A = "hh:mm A", // 12-hour with AM/PM
}

export enum ArrDeptDateFormat {
  DD_MM_YYYY = "DD-MM-YYYY",
  MM_DD_YYYY = "MM-DD-YYYY",
  YYYY_MM_DD = "YYYY-MM-DD",
  DD_MMM_YYYY = "DD-MMM-YYYY",
}

export enum WebRateMode {
  Regular = "Regular",
  Allocated = "Allocated",
}

export enum GroupPaymentPostingMode {
  GroupOwner = "Group Owner",
  RoomDistribution = "Room Distribution",
}

export enum RoundOffType {
  ROUND_DOWN = "-1",
  NO_ROUND_OFF = "<>0", // Assuming this represents no rounding off
  ROUND_UP = "1",
}

export enum DefaultReservationType {
  CONFIRM_BOOKING = "Confirm Booking",
  TENTATIVE = "Tentative",
}

export enum BillToType {
  GUEST = "Guest",
  COMPANY = "Company",
  AGENT = "Agent",
}

export enum PaymentMode {
  CASH_BANK = "Cash/Bank",
  CITY_LEDGER = "City Ledger",
}

export enum PaymentGateway {
  COMMON_PG = "Common PG",
  SHIFT4 = "shift4",
}

@Entity("master_display_settings")
export class MasterDisplaySetting extends CoreEntity {
  @Column({ type: "int", unique: true, nullable: false })
  sbu_id: number;

  @Column({ type: "varchar", length: 7, nullable: true })
  theme_color_primary: string;

  @Column({ type: "varchar", length: 7, nullable: true })
  theme_color_secondary: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  font_family: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  currency_display_format: string;

  @Column({ type: "enum", enum: DateFormat, default: DateFormat.DD_MM_YYYY })
  date_format: DateFormat;

  @Column({
    type: "enum",
    enum: ArrDeptDateFormat,
    default: ArrDeptDateFormat.DD_MM_YYYY,
  })
  arr_dept_date_format: ArrDeptDateFormat;

  @Column({ type: "enum", enum: TimeFormat, default: TimeFormat.HH_MM_24 })
  time_format: TimeFormat;

  @Column({ type: "varchar", length: 10, default: "en" })
  language_code: string;

  @Column({ type: "boolean", default: true })
  show_invoice_terms: boolean;

  @Column({ type: "json", nullable: true })
  weekend_days: object;

  @Column({
    type: "enum",
    enum: RoundOffType,
    default: RoundOffType.NO_ROUND_OFF,
  })
  round_off_type: RoundOffType;

  @Column({ type: "int", nullable: true })
  round_off_limit: number;

  @Column({ type: "boolean", default: false })
  add_up_round_off_to_rates: boolean;

  @Column({ type: "enum", enum: SalutationType, default: SalutationType.MR })
  salutation: SalutationType;

  @Column({ type: "enum", enum: IdentityType, default: IdentityType.NID })
  identity_type: IdentityType;

  @Column({
    type: "enum",
    enum: DefaultReservationType,
    default: DefaultReservationType.CONFIRM_BOOKING,
  })
  default_reservation_type: DefaultReservationType;

  @Column({ type: "enum", enum: BillToType, nullable: true })
  bill_to: BillToType;

  @Column({ type: "varchar", length: 100, nullable: true })
  state_caption: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  zip_code_caption: string;

  @Column({ type: "boolean", default: false })
  is_tax_inclusive_rates: boolean;

  @Column({ type: "enum", enum: WebRateMode, default: WebRateMode.Regular })
  web_rate_mode: WebRateMode;

  @Column({ type: "enum", enum: WebRateMode, default: WebRateMode.Regular })
  web_room_inventory_mode: WebRateMode;

  @Column({
    type: "enum",
    enum: GroupPaymentPostingMode,
    default: GroupPaymentPostingMode.GroupOwner,
  })
  group_payment_posting_mode: GroupPaymentPostingMode;

  @Column({ type: "boolean", default: false })
  registration_no_mandatory_for_travel_agent: boolean;

  @Column({ type: "enum", enum: PaymentMode, nullable: true })
  payment_mode: PaymentMode;

  @Column({ type: "enum", enum: PaymentGateway, nullable: true })
  payment_gateway: PaymentGateway;

  @Column({ type: "varchar", length: 100, nullable: true })
  timezone: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  country: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  nationality: string;

  @Column({
    name: "generate_invoice_on_checkout",
    default: false,
    nullable: true,
  })
  generate_invoice_on_checkout: boolean;

  @Column({
    name: "generate_invoice_on_cancel",
    default: false,
    nullable: true,
  })
  generate_invoice_on_cancel: boolean;

  @Column({
    name: "generate_invoice_on_no_show",
    default: false,
    nullable: true,
  })
  generate_invoice_on_no_show: boolean;

  @Column({
    name: "generate_single_invoice_for_groups",
    default: false,
    nullable: true,
  })
  generate_single_invoice_for_groups: boolean;

  @Column({
    name: "no_charge_void_charge_folio",
    default: false,
    nullable: true,
  })
  no_charge_void_charge_folio: boolean;

  @Column({
    type: "enum",
    enum: DisplaySettingStatus,
    default: DisplaySettingStatus.Active,
    nullable: false,
  })
  status: DisplaySettingStatus;

  // Relationships
  @OneToOne(() => MasterSbu, (sbu) => sbu.displaySettings)
  @JoinColumn({ name: "sbu_id" })
  sbu: MasterSbu;
}
