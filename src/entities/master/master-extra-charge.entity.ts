import { MasterSbu } from "src/entities/master/master_sbu.entity";
import { CoreEntity } from "src/utils/core-entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

// Enums for dropdown selections from the form
export enum RateType {
  FLAT_PERCENTAGE = "Flat Percentage",
  FLAT_AMOUNT = "Flat Amount",
}

export enum ApplyOnOfferedRoomRentType {
  NET_RATE = "Net Rate",
  SELL_RATE = "Sell Rate",
}

export enum VoucherNoType {
  AUTO_PRIVATE = "Auto - Private",
  AUTO_General = "Auto - General",
  MANUAL = "Manual",
}

export enum PostingRuleType {
  CHECK_IN_AND_CHECK_OUT = "CheckIn and CheckOut",
  EVERYDAY = "Everyday",
  EVERY_DAY_EXCEPT_CHECK_IN = "Everyday except CheckIn",
  ONLY_CHECK_IN = "Only CheckIn",
  ONLY_CHECK_OUT = "Only CheckOut",
}

export enum ExtraChargesStatus {
  ACTIVE = "Active",
  INACTIVE = "Inactive",
}

@Entity("master_extra_charges")
export class MasterExtraCharge extends CoreEntity {
  @Column({ type: "int", nullable: false })
  sbu_id: number;

  @Column({ type: "varchar", length: 50, nullable: false })
  short_code: string;

  @Column({ type: "varchar", length: 255, nullable: false })
  name: string;

  @Column({ type: "enum", enum: RateType, nullable: false })
  rate: RateType;

  @Column({ type: "integer", nullable: true })
  front_desk_sort_key: number;

  @Column({ type: "boolean", default: false, nullable: false })
  is_fixed_price: boolean;

  // We can use a single field for the rate value, which is then
  // interpreted based on the 'rate' enum.
  @Column({ type: "float", nullable: true })
  rate_value: number;

  @Column({ type: "enum", enum: ApplyOnOfferedRoomRentType, nullable: false })
  apply_on_offered_room_rent: ApplyOnOfferedRoomRentType;

  // We're keeping taxes as a jsonb array for flexibility.
  @Column({ type: "simple-array", nullable: true })
  taxes: number[];

  @Column({ type: "integer", nullable: true })
  rate_inclusive_tax: number;

  // Boolean fields are already correctly typed.
  @Column({ type: "boolean", default: false, nullable: false })
  publish_on_web: boolean;

  @Column({ type: "boolean", default: false, nullable: false })
  always_charge: boolean;

  @Column({ type: "enum", enum: VoucherNoType, nullable: false })
  voucher_no_type: VoucherNoType;

  @Column({ type: "varchar", length: 50, nullable: true })
  voucher_prefix: string;

  @Column({ type: "integer", nullable: true })
  voucher_start_from: number;

  // This would likely be a foreign key to another table.
  @Column({ type: "varchar", length: 255, nullable: true })
  web_applies_on: string;

  @Column({ type: "enum", enum: PostingRuleType, nullable: true })
  web_posting_rule: PostingRuleType;

  @Column({ type: "text", nullable: true })
  web_description: string;

  @Column({ type: "integer", nullable: true })
  web_res_sort_key: number;

  @Column({ type: "date", nullable: true })
  web_valid_from: Date;

  @Column({ type: "date", nullable: true })
  web_valid_to: Date;

  @Column({
    type: "enum",
    enum: ExtraChargesStatus,
    default: ExtraChargesStatus.ACTIVE,
    nullable: false,
  })
  status: ExtraChargesStatus;

  @ManyToOne(() => MasterSbu, { nullable: false })
  @JoinColumn({ name: "sbu_id" })
  sbu: MasterSbu;
}
