import { Entity, Column, OneToMany } from "typeorm";
import { CoreEntity } from "src/utils/core-entity";
import { PosTable } from "./pos-table.entity";
import { PosMenu } from "./pos-menu.entity";

@Entity("pos_outlets")
export class PosOutlet extends CoreEntity {
    @Column({ type: "varchar", length: 255 })
    name: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    location: string;

    @Column({ type: "text", nullable: true })
    description: string;

    @OneToMany(() => PosTable, (table) => table.outlet)
    tables: PosTable[];

    @OneToMany(() => PosMenu, (menu) => menu.outlet)
    menu_items: PosMenu[];

}
