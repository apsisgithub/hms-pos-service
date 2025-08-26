import {
    Entity,
    Column,
    ManyToOne,
    JoinColumn,
    OneToMany,
} from "typeorm";
import { CoreEntity } from "src/utils/core-entity";
import { Reservation } from "./master_reservation.entity";
import { MasterCurrency } from "src/modules/master-currencies/entities/master_currencies.entity";
import { MasterPayments } from "./master_payments.entity";
import { MasterSbu } from "src/modules/master-sbu/entities/master_sbu.entity";

export enum CardType {
    PHYSICAL_CARD = "physical_card",
    VIRTUAL_CARD = "virtual_card",
}

@Entity("master_credit_cards")
export class MasterCreditCard extends CoreEntity {
    @Column({ type: "int", nullable: false })
    sbu_id: number;

    @Column({ type: "int", nullable: true })
    reservation_id: number;

    @Column({ type: "varchar", length: 20, nullable: false })
    card_number: string;

    @Column({ type: "varchar", length: 100, nullable: false })
    card_holder_name: string;

    @Column({ type: "int", nullable: false })
    expiry_month: number;

    @Column({ type: "int", nullable: false })
    expiry_year: number;

    @Column({ type: "int", nullable: false })
    cvv: number;

    @Column({
        type: "enum",
        enum: CardType,
        nullable: false,
    })
    card_type: CardType;

    // Relationships
    @ManyToOne(() => MasterSbu, (sbu) => sbu.creditCards)
    @JoinColumn({ name: "sbu_id" })
    sbu: MasterSbu;

    @ManyToOne(() => Reservation, (reservation) => reservation.creditCards)
    @JoinColumn({ name: "reservation_id" })
    reservation: Reservation;

    @OneToMany(() => MasterPayments, (payment) => payment.creditCard)
    payments: MasterPayments[];


}