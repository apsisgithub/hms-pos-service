import { CoreEntity } from "src/utils/core-entity";
import { Column, Entity } from "typeorm";

@Entity("master_market_code")
export class MasterMarketCode extends CoreEntity {
    @Column({ type: "varchar", nullable: false })
    market_code_name: string;

    @Column({ type: "int", nullable: false })
    sbu_id: number;
}
