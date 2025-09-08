import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Product } from "./products.entity";

@Entity("pos_product_variants")
export class ProductVariant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "int", nullable: false })
  product_id: number;

  @ManyToOne(() => Product, (product) => product.variants, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "product_id" })
  product: Product;

  @Column({
    name: "variant_name",
    type: "varchar",
    length: 255,
    nullable: false,
  })
  variant_name: string;

  @Column({
    name: "sku",
    type: "varchar",
    length: 255,
    nullable: true,
  })
  sku: string | null;

  @Column({
    name: "price",
    type: "decimal",
    precision: 10,
    scale: 2,
    nullable: false,
  })
  price: number;

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
