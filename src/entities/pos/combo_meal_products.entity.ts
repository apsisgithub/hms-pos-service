import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  JoinColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from "typeorm";
import { ComboMeal } from "./combo_meals.entity";
import { Product } from "./products.entity";

@Entity("pos_combo_meal_products")
export class ComboMealProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  combo_id: number;

  @Column()
  product_id: number;

  @Column({ type: "int", default: 1 })
  quantity: number;

  @ManyToOne(() => ComboMeal, (combo) => combo.items, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "combo_id" })
  combo: ComboMeal;

  @ManyToOne(() => Product, { onDelete: "CASCADE", eager: true })
  @JoinColumn({ name: "product_id" })
  product: Product;

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
}
