import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Category } from "./category.entity";
import { MasterSbu } from "../master/master_sbu.entity";
import { Outlet } from "./outlet.entity";
import { ProductVariant } from "./product-varient.entity";
import { ProductAddon } from "./product_addons.entity";
import { ComboMealProduct } from "./combo_meal_products.entity";
import { Kitchen } from "./kitchen.entity";

@Entity("pos_products")
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "uuid", unique: true })
  @Generated("uuid")
  uuid: string;

  @Column({ type: "int", nullable: false })
  sbu_id: number;

  @Column({ type: "int", nullable: false })
  outlet_id: number;

  @Column({ name: "category_id", type: "int" })
  category_id: number;

  @Column({ name: "subcategory_id", type: "int", nullable: false })
  subcategory_id: number;

  @Column({ name: "name", type: "varchar", length: 255, nullable: true })
  name: string | null;

  @Column({
    name: "image",
    type: "varchar",
    length: 200,
    nullable: true,
  })
  image: string | null;

  @Column({ name: "description", type: "text", nullable: true })
  description: string | null;

  @Column({ name: "menu_type", type: "varchar", length: 25, nullable: true })
  menu_type: string | null;

  @Column({
    name: "product_vat",
    type: "decimal",
    precision: 10,
    scale: 3,
    default: 0,
  })
  product_vat: number;

  @Column({ name: "is_special", type: "int", default: 0 })
  is_special: number | null;

  @Column({
    name: "Offer_rate",
    type: "int",
    default: 0,
    comment: "1=offer rate",
  })
  offer_rate: number;

  @Column({
    name: "offer_is_available",
    type: "int",
    default: 0,
    comment: "1=offer available,0=No Offer",
  })
  offer_is_available: number;

  @Column({ name: "offer_start_date", type: "date", nullable: true })
  offer_start_date: Date | null;

  @Column({
    name: "offer_end_date",
    type: "date",
    nullable: true,
  })
  offer_end_date: Date | null;

  @Column({ name: "component", type: "text", nullable: true })
  component: string | null;

  @Column({ name: "Position", type: "int", nullable: true })
  position: number | null;

  @Column({ name: "kitchen_id", type: "int" })
  kitchen_id: number;

  @Column({ name: "is_group", type: "int", default: 0 })
  is_group: number | null;

  @Column({ name: "is_varient", type: "int", default: 0 })
  is_varient: number | null;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  base_price: number;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  discount: number;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  price: number;

  @Column({ name: "is_custom_qty", type: "int", default: 0 })
  is_custom_qty: number;

  @Column({ name: "cooked_time", type: "time", default: () => "'00:00:00'" })
  cooked_time: string;

  @Column({
    name: "is_active",
    type: "tinyint",
    nullable: true,
    transformer: {
      to: (value: boolean) => (value ? 1 : 0),
      from: (value: number) => Boolean(value),
    },
  })
  is_active: boolean | null;

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

  // Optional relations (not required, but nice to have)
  @ManyToOne(() => MasterSbu, (s) => (s as any).products, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: "sbu_id" })
  sbu?: MasterSbu;

  @ManyToOne(() => Outlet, (o) => (o as any).products, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: "outlet_id" })
  outlet?: Outlet;

  // OneToMany relation with ProductVariant
  @OneToMany(() => ProductVariant, (variant) => variant.product)
  variants?: ProductVariant[];

  // OneToMany relation with ProductAddon
  @OneToMany(() => ProductAddon, (productAddon) => productAddon.product)
  addons?: ProductAddon[];

  // relation with combo meals
  @OneToMany(() => ComboMealProduct, (cmp) => cmp.product)
  combos: ComboMealProduct[];

  // Add other relations with product
  @ManyToOne(() => Kitchen, (kitchen) => kitchen.products)
  @JoinColumn({ name: "kitchen_id" })
  kitchen: Kitchen;

  @ManyToOne(() => Category, (category) => category.mainProducts)
  @JoinColumn({ name: "category_id" })
  category: Category;

  @ManyToOne(() => Category, (category) => category.subProducts)
  @JoinColumn({ name: "subcategory_id" })
  subcategory: Category;
}
