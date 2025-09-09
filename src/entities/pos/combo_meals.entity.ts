import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  Generated,
} from "typeorm";
import { ComboMealProduct } from "./combo_meal_products.entity";

@Entity("pos_combo_meals")
export class ComboMeal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "uuid", unique: true })
  @Generated("uuid")
  uuid: string;

  @Column({ type: "varchar", length: 255 })
  name: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  price: number;

  @Column({ type: "boolean", default: true })
  is_active: boolean;

  @CreateDateColumn({ type: "timestamp" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at: Date;

  @DeleteDateColumn({ type: "timestamp", nullable: true })
  deleted_at?: Date | null;

  @Column({ type: "int", nullable: true })
  created_by: number | null;

  @Column({ type: "int", nullable: true })
  updated_by: number | null;

  @Column({ type: "int", nullable: true })
  deleted_by: number | null;

  @OneToMany(() => ComboMealProduct, (cmp) => cmp.combo, {
    cascade: true,
    eager: true,
  })
  items: ComboMealProduct[];
}
