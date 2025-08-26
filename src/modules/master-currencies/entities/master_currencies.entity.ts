import { UniqueSoftDelete } from "src/common/decorators/unique-sof-delete.decorator";
import { MasterPosPoint } from "src/modules/master-pos/entities/master_pos.entity";
import { MasterCreditCard } from "src/modules/master-reservation/entities/master_credit_card.entity";
import { MasterPayments } from "src/modules/master-reservation/entities/master_payments.entity";
import { MasterSbu } from "src/modules/master-sbu/entities/master_sbu.entity";
import { CoreEntity } from "src/utils/core-entity";
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from "typeorm";

// Placeholder for MasterCountry entity
// @Entity("master_countries")
// class MasterCountry {
//     @PrimaryGeneratedColumn()
//     id: number;

//     @Column()
//     name: string;
// }

export enum CurrencyStatus {
    Active = "Active",
    Inactive = "Inactive",
}

@Entity("master_currencies")
@UniqueSoftDelete(["currency_code", "sbu_id"], "composite_idx_currencyCode")
export class MasterCurrency extends CoreEntity {
    @Column({ type: "int", nullable: false })
    sbu_id: number;

    @Column({ type: "varchar", nullable: false })
    country: string;

    @Column({ type: "varchar", length: 10, nullable: false })
    currency_code: string;

    @Column({ type: "varchar", length: 10, nullable: false })
    currency: string;

    @Column({ type: "varchar", length: 10, nullable: true })
    sign: string;

    @Column({ type: "boolean", default: true })
    is_sign_prefix: boolean; // True for Prefix, False for Suffix

    @Column({ type: "int", default: 2, nullable: false })
    digits_after_decimal: number;

    @Column({ type: "decimal", precision: 10, scale: 4, nullable: false })
    base_exchange_rate: number;

    @Column({ type: "decimal", precision: 10, scale: 4, nullable: false })
    dollar_exchange_rate: number;

    @Column({
        type: "enum",
        enum: CurrencyStatus,
        default: CurrencyStatus.Active,
        nullable: false,
    })
    status: CurrencyStatus;

    @ManyToOne(() => MasterSbu, (sbu) => sbu.currencies)
    @JoinColumn({ name: "sbu_id" })
    sbu: MasterSbu;

    @OneToMany(() => MasterPosPoint, (posPoint) => posPoint.currency)
    posPoints: MasterPosPoint[];

    @OneToMany(() => MasterPayments, (payment) => payment.currency)
    creditCards: MasterPayments[];
}
