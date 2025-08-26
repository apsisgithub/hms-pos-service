import { CoreEntity } from "src/utils/core-entity";
import { Column, Entity } from "typeorm";

@Entity("master_currency_exchange_rates")
export class MasterCurrencyExchangeRates extends CoreEntity {
    @Column({ type: "int", nullable: false })
    sbu_id: number;

    @Column({ type: "varchar", nullable: false })
    country: string;

    @Column({ type: "varchar", nullable: false })
    name: string;

    @Column({ type: "varchar", nullable: false })
    currency_code: string;

    @Column({ type: "varchar", nullable: false })
    digits_after_decimal: string;

    @Column({ type: "float", nullable: false })
    base_exchange_rate: number;

    @Column({ type: "float", nullable: false })
    dollar_exchange_rate: number;
}
