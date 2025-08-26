import {
    Entity,
    Column,
    ManyToOne,
    JoinColumn,
    OneToMany,
    OneToOne,
} from "typeorm";
import { MasterBusinessAgent } from "src/modules/master-business-agents/entities/master-business-agent.entity";
import { MasterSbu } from "src/modules/master-sbu/entities/master_sbu.entity";
import { ReservationRoom } from "./master_reservation_room.entity";
import { CoreEntity } from "src/utils/core-entity";
import { MasterBusinessSource } from "src/modules/master-business-sources/entities/master_business_sources.entity";
import { ReservationBillingDetails } from "src/modules/master-reservation-billing-info/entities/master-reservation-billing-info.entity";
import { MasterReservationGuests } from "./master_reservation_guests.entity";
import { MasterPaymentMode } from "src/modules/master-payment-modes/entities/master_payment_modes.entity";
import { MasterCreditCard } from "./master_credit_card.entity";
import { MasterPayments } from "./master_payments.entity";
import { MasterCharges } from "./master_charges.entity";
import { MasterFolios } from "./master_folios.entity";

export enum ReservationStatus {
    CONFIRMED = "Confirmed",
    TENTATIVE = "Tentative",
    CANCELLED = "Cancelled",
    CHECKED_IN = "CheckedIn",
    CHECKED_OUT = "CheckedOut",
    PENDING = "Pending",
}

export enum ActiveStatus {
    ACTIVE = "Active",
    INACTIVE = "Inactive",
}

export enum PaymentStatus {
    PAID = "Paid",
    PENDING = "Pending",
    REFUNDED = "Refunded",
    PARTIALLY_PAID = "Partially Paid",
}

export enum RateType {
    RATE_PER_NIGHT = "Rate Per Night",
    TOTAL_RATE_FOR_STAY = "Total Rate for Stay",
}
@Entity("master_reservations")
export class Reservation extends CoreEntity {
    @Column({ type: "varchar", length: 100, nullable: false, unique: true })
    reservation_number: string;

    @Column({ type: "int", nullable: false })
    sbu_id: number;

    @Column({ type: "int", nullable: true })
    business_agent_id: number;

    @Column({ type: "int", default: 0, nullable: false })
    total_adults: number;

    @Column({ type: "int", default: 0, nullable: false })
    total_children: number;

    @Column({ type: "varchar", length: 50, nullable: true })
    payment_currency_choice: string;

    @Column({ type: "decimal", precision: 12, scale: 2, default: 0.0 })
    total_calculated_rate: number;

    @Column({ type: "decimal", precision: 10, scale: 4, nullable: true })
    exchange_rate_show: number;

    @Column({ type: "boolean", default: false })
    extra_bed_required: boolean;

    @Column({ type: "boolean", default: false })
    split_reservation_flag: boolean;

    @Column({ type: "boolean", default: false })
    pickup_drop_required: boolean;

    @Column({ type: "datetime", nullable: true })
    pickup_drop_time: Date;

    @Column({ type: "boolean", default: false })
    send_email_at_checkout: boolean;

    @Column({ type: "text", nullable: true })
    email_booking_vouchers: string;

    @Column({ type: "boolean", default: false })
    display_inclusion_separately_on_folio: boolean;

    @Column({ type: "boolean", default: false })
    is_rate_includes_taxes: boolean;

    @Column({ type: "boolean", default: false })
    is_day_use: boolean;

    @Column({
        type: "enum",
        enum: ReservationStatus,
        default: ReservationStatus.CONFIRMED,
    })
    status: ReservationStatus;

    @Column({
        type: "enum",
        enum: RateType,
        default: RateType.RATE_PER_NIGHT,
    })
    rate_type: RateType;

    @Column({
        type: "enum",
        enum: PaymentStatus,
        default: PaymentStatus.PENDING,
        name: "payment_status",
    })
    payment_status: PaymentStatus;

    @Column({ type: "int", nullable: true })
    payment_mode_id: number;

    @Column({ type: "int", nullable: true })
    business_source_id: number;

    @Column({ type: "decimal", precision: 12, scale: 2, default: 0.0 })
    advance_paid_amount: number;

    // Merged check_in_date and check_in_time into check_in_datetime
    @Column({ type: "datetime", nullable: false })
    check_in_datetime: Date;

    // Merged check_out_date and check_out_time into check_out_datetime
    @Column({ type: "datetime", nullable: false })
    check_out_datetime: Date;

    @Column({ type: "datetime", nullable: true })
    reservation_date: Date;

    @Column({ type: "varchar", length: 50, nullable: true })
    booking_source: string;

    @Column({ type: "varchar", length: 100, nullable: true })
    channel_name: string;

    @Column({ type: "varchar", length: 100, nullable: true })
    reservation_source_reference: string;

    @Column({ type: "varchar", length: 100, nullable: true })
    booking_purpose: string;

    @Column({ type: "text", nullable: true })
    special_requests: string;

    @Column({ type: "varchar", length: 100, nullable: true })
    cancelled_by: string;

    @Column({ type: "datetime", nullable: true })
    cancelled_at: Date;

    @Column({ type: "text", nullable: true })
    cancellation_reason: string;

    @ManyToOne(() => MasterSbu, (sbu) => sbu.reservations)
    @JoinColumn({ name: "sbu_id" })
    sbu: MasterSbu;

    @ManyToOne(
        () => MasterBusinessAgent,
        (businessAgent) => businessAgent.reservations, // Corrected to 'reservations'
        { nullable: true }
    )
    @JoinColumn({ name: "business_agent_id" })
    businessAgent: MasterBusinessAgent;

    @ManyToOne(
        () => MasterPaymentMode,
        (payment_mode) => payment_mode.reservation, // Corrected to 'reservations'
        { nullable: true }
    )
    @JoinColumn({ name: "payment_mode_id" })
    payment_mode: MasterPaymentMode;

    @OneToMany(
        () => ReservationRoom,
        (reservationRoom) => reservationRoom.reservation
    )
    reservationRooms: ReservationRoom[];

    @OneToMany(
        () => ReservationRoom,
        (reservationRoom) => reservationRoom.reservation
    )
    foliosRoomsMappings: ReservationRoom[];

    @ManyToOne(
        () => MasterBusinessSource,
        (businessSource) => businessSource.reservations
    )
    @JoinColumn({ name: "business_source_id" })
    businessSource: MasterBusinessSource;

    @OneToOne(
        () => ReservationBillingDetails,
        (billingInfo) => billingInfo.reservation
    )
    billingDetails: ReservationBillingDetails;

    @OneToMany(
        () => MasterReservationGuests,
        (reservationGuests) => reservationGuests.reservation
    )
    reservationGuests: MasterReservationGuests[];

    @OneToMany(() => MasterCreditCard, (creditCard) => creditCard.reservation)
    creditCards: MasterCreditCard[];

    @OneToMany(() => MasterPayments, (payment) => payment.payment_mode)
    payments: MasterPayments[];

    @OneToMany(() => MasterFolios, (folio) => folio.reservation)
    folios: MasterFolios[];
}
