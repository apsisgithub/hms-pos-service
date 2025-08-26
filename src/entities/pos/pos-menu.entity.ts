import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { CoreEntity } from "src/utils/core-entity";
import { PosOutlet } from "./pos-outlet.entity";
import { MasterMeasurementUnit } from "src/entities/master/master_measurement_unit.entity";

@Entity("pos_menus")
export class PosMenu extends CoreEntity {
  @Column()
  outlet_id: number;

  @Column()
  unit_id: number;

  @Column({ type: "varchar", length: 255 })
  item_name: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  price: number;

  @Column({ type: "text", nullable: true })
  description: string;

  @JoinColumn({ name: "unit_id" })
  unit: MasterMeasurementUnit;

  @JoinColumn({ name: "outlet_id" })
  outlet: PosOutlet;
}
