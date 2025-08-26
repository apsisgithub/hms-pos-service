import { MasterSbu } from "src/entities/master/master_sbu.entity";
import { CoreEntity } from "src/utils/core-entity";
import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Index,
} from "typeorm";
import { ReservationBillingDetails } from "src/entities/master/master-reservation-billing-info.entity";
import { MasterReservationGuests } from "./master_reservation_guests.entity";
import { MasterFolios } from "./master_folios.entity";

// Define the enum type for ID verification methods
export enum IdVerificationType {
  NID = "nid",
  PASSPORT = "passport",
  DRIVING_LICENSE = "driving_license",
  BIRTH_CERTIFICATE = "birth_certificate",
  OTHER = "other",
}

export enum GuestType {
  ADULT = "Adult",
  CHILD = "Child",
  INFANT = "Infant",
  OTHER = "Other",
}

export enum MaritalStatus {
  SINGLE = "Single",
  MARRIED = "Married",
  DIVORCED = "Divorced",
  WIDOWED = "Widowed",
  OTHER = "Other",
}

export enum GenderType {
  MALE = "Male",
  FEMALE = "Female",
  OTHER = "Other",
}

export enum VipStatus {
  BRONZE = "Bronze",
  GOLD = "Gold",
  PLATINUM = "Platinum",
  SILVER = "Silver",
  DIAMOND = "Diamond",
}

export enum PurposeOfVisit {
  BUSINESS_AND_MICE = "Business & MICE",
  EVENT = "Event (Music, Festival, etc.)",
  GOVERNMENT_DIPLOMATIC = "Government/Diplomatic",
  LEISURE_OR_SPECIAL_OCCASION = "Leisure or Special Occasion",
  OTHER = "Other (Medical, Transit, etc.)",
}

export enum PreferencesType {
  Others = "Others",
  HK = "HK",
  F_AND_B = " F&B",
  FRONT_OFFICE = "Front Office",
}
@Entity("master_guests")
@Index("IDX_GUEST_NAME_FULLTEXT", ["name"], { fulltext: true })
@Index("IDX_GUEST_EMAIL_FULLTEXT", ["email"], { fulltext: true })
@Index("IDX_GUEST_CONTACT_FULLTEXT", ["contact_no"], { fulltext: true })
@Index("IDX_GUEST_ALL_FULLTEXT", ["name", "email", "contact_no"], {
  fulltext: true,
})
export class MasterGuest extends CoreEntity {
  @Column({ type: "varchar", length: 255, nullable: true })
  guest_image_url: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  salutation: string;

  @Column({ type: "varchar", length: 255, nullable: false })
  name: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  contact_no: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  phone: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  email: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  occupation: string;

  @Column({ type: "enum", enum: VipStatus, nullable: true })
  vip_status: VipStatus;

  @Column({
    type: "enum",
    enum: GenderType,
    nullable: false,
    default: GenderType.MALE,
  })
  gender: GenderType;

  @Column({ type: "varchar", length: 100, nullable: true })
  nationality: string;

  @Column({
    type: "enum",
    enum: IdVerificationType,
    nullable: true,
    name: "id_type",
  })
  id_type: IdVerificationType;

  @Column({ type: "varchar", length: 255, nullable: true })
  id_image_url: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  id_number: string;

  @Column({ type: "date", nullable: true })
  id_expiry_date: Date;

  @Column({ type: "varchar", length: 100, nullable: true })
  id_issuing_country: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  id_issuing_city: string;

  @Column({ type: "enum", enum: GuestType, nullable: true })
  guest_type: GuestType;

  @Column({ type: "date", nullable: true })
  date_of_birth: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  birth_country: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  birth_city: string;

  @Column({ type: "enum", nullable: true, enum: PurposeOfVisit })
  purpose_of_visit: PurposeOfVisit;

  @Column({ type: "text", nullable: true })
  address: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  country: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  state: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  city: string;

  @Column({ type: "varchar", length: 20, nullable: true })
  postal_code: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  designation: string;

  @Column({ type: "text", nullable: true })
  work_address: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  work_country: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  work_state: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  work_city: string;

  @Column({ type: "varchar", length: 20, nullable: true })
  work_postal_code: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  work_phone1: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  work_phone2: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  work_fax: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  work_email: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  work_website: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  vehicle_registration_no: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  license_number: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  license_country: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  license_state: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  spouse_name: string;

  @Column({ type: "date", nullable: true })
  spouse_dob: Date;

  @Column({ type: "date", nullable: true })
  marriage_anniversary: Date;

  /* extra fields but usually in the hotel its required

    @Column({ type: "varchar", length: 255, nullable: true })
    emergency_contact_name: string;

    @Column({ type: "varchar", length: 100, nullable: true })
    emergency_contact_relation: string;

    @Column({ type: "varchar", length: 50, nullable: true })
    emergency_contact_phone: string; 
  
  */

  @Column({ type: "enum", enum: MaritalStatus, nullable: true })
  marital_status: MaritalStatus;

  @Column({ type: "varchar", length: 20, nullable: true })
  title: string;

  @Column({ type: "text", nullable: true })
  personal_preferences: string;

  @Column({ type: "boolean", default: false })
  is_member: boolean;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0.0 })
  total_points_earned: number;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0.0 })
  redeemed_points: number;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0.0 })
  remaining_points: number;

  @Column({ type: "int", nullable: true })
  sbu_id: number;

  @ManyToOne(() => MasterSbu, (sbu) => sbu.guests, { nullable: true })
  @JoinColumn({ name: "sbu_id" })
  sbu: MasterSbu;

  @Column({ type: "varchar", length: 255, nullable: true })
  company_name: string;

  @OneToMany(
    () => ReservationBillingDetails,
    (billingInfo) => billingInfo.guest
  )
  billingDetails: ReservationBillingDetails;

  @OneToMany(
    () => MasterReservationGuests,
    (reservationGuests) => reservationGuests.guest
  )
  reservationGuests: MasterReservationGuests[];

  @OneToMany(() => MasterFolios, (folio) => folio.guest)
  folios: MasterFolios[];
}
