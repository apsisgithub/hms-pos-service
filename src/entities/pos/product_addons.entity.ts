import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from "typeorm";
import { Product } from "./products.entity";
import { Addon } from "./addons.entity";

@Entity("pos_product_addons")
export class ProductAddon {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "int" })
  product_id: number;

  @Column({ type: "int" })
  addon_id: number;

  @ManyToOne(() => Product, (product) => product.addons, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "product_id" })
  product: Product;

  @ManyToOne(() => Addon, { eager: true, onDelete: "CASCADE" })
  @JoinColumn({ name: "addon_id" })
  addon: Addon;

  @Column({
    type: "decimal",
    precision: 10,
    scale: 2,
    nullable: true,
    comment: "If set, overrides addon base price",
  })
  extra_price: number | null;

  @CreateDateColumn({ name: "created_at" })
  created_at: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updated_at: Date;

  @DeleteDateColumn({ name: "deleted_at" })
  deleted_at: Date | null;

  @Column({ type: "int", nullable: true })
  created_by: number | null;

  @Column({ type: "int", nullable: true })
  updated_by: number | null;

  @Column({ type: "int", nullable: true })
  deleted_by: number | null;
}
