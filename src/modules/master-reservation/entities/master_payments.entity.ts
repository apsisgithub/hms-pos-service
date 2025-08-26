import {
    Entity,
    Column,
    ManyToOne,
    JoinColumn,
    BeforeInsert,
} from "typeorm";
import { CoreEntity } from "src/utils/core-entity";
import { Reservation } from "./master_reservation.entity";
import { MasterCurrency } from "src/modules/master-currencies/entities/master_currencies.entity";
import { MasterPaymentMode } from "src/modules/master-payment-modes/entities/master_payment_modes.entity";
import { MasterCreditCard } from "./master_credit_card.entity";
import { MasterSbu } from "src/modules/master-sbu/entities/master_sbu.entity";
import { MasterFolios } from "./master_folios.entity";
import { v4 as uuidv4 } from 'uuid';


export enum PaymentStatusTypes {
    Pending = "pending",
    Paid = "paid",
    Failed = "failed",
    Refunded = "refunded",
    PartiallyRefunded = "partially_refunded",
    Chargeback = "chargeback",
    Expired = "expired",
    Cancelled = "cancelled",
}


@Entity("master_payments")
export class MasterPayments extends CoreEntity {
    @Column({ type: "int", nullable: true })
    ref_no: number;

    @Column({ type: "int", nullable: true })
    folio_id: number;

    @Column({ type: "varchar", length: 36, nullable: false, unique: true })
    transaction_id: string;

    @Column({ type: "int", nullable: false })
    sbu_id: number;

   

    @Column({ type: "int", nullable: true })
    currency_id: number;

    @Column({ type: "int", nullable: true })
    credit_card_id: number;

    @Column({ type: "int", nullable: false })
    payment_mode_id: number;

    @Column({ type: "decimal", precision: 12, scale: 2, nullable: false })
    paid_amount: number;

    @Column({ type: "date", nullable: true })
    paid_date: Date;

    @ManyToOne(
        () => MasterPaymentMode,
        (payment_mode) => payment_mode.reservation,
        { nullable: true }
    )
    @JoinColumn({ name: "payment_mode_id" })
    payment_mode: MasterPaymentMode;


    @Column({
        type: "enum",
        enum: PaymentStatusTypes,
        nullable: false,
        default: PaymentStatusTypes.Paid
    })
    payment_status: PaymentStatusTypes;

    @Column({ type: "varchar", length: 255, nullable: false })
    description: string;

    

    // Relationships
    @ManyToOne(() => MasterSbu, (sbu) => sbu.payments)
    @JoinColumn({ name: "sbu_id" })
    sbu: MasterSbu;

   
    @ManyToOne(() => MasterCurrency, (currency) => currency.creditCards)
    @JoinColumn({ name: "currency_id" })
    currency: MasterCurrency;

    @ManyToOne(() => MasterCreditCard, (credit_card) => credit_card.payments)
    @JoinColumn({ name: "credit_card_id" })
    creditCard: MasterCreditCard;

    @ManyToOne(() => MasterFolios, (folio) => folio.payments)
    @JoinColumn({ name: "folio_id" })
    folio: MasterFolios;

    @BeforeInsert()
    generateTransactionId() {
        this.transaction_id = uuidv4();
    }
}