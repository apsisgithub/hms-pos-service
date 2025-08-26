import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { CoreEntity } from "src/utils/core-entity";
import { MasterFolios } from "./master_folios.entity";

@Entity("master_folio_discounts")
export class MasterFolioDiscount extends CoreEntity {
    @Column({ type: "int", nullable: false })
    discount_id: number;

    @Column({ type: "decimal", precision: 10, scale: 2, nullable: false })
    discount_amount: number;

    @Column({ type: "int", nullable: false })
    folio_id: number;

    @Column({ type: "text", nullable: true })
    description: string;

    // Relationships
    @ManyToOne(() => MasterFolios, (folio) => folio.discounts)
    @JoinColumn({ name: "folio_id" })
    folio: MasterFolios;
}