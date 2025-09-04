import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Generated,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
} from "typeorm";
import { Product } from "./products.entity";

@Entity("pos_categories")
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "uuid", unique: true })
  @Generated("uuid")
  uuid: string;

  @Column({ type: "int", nullable: false })
  sbu_id: number;

  @Column({ type: "int", nullable: false })
  outlet_id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  slug: string;

  @Column({ nullable: true })
  picture: string;

  // Parent category
  @ManyToOne(() => Category, (category) => category.children, {
    nullable: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "parent_id" })
  parent?: Category | null;

  @Column({ type: "int", nullable: true })
  parent_id?: number;

  // Children categories
  @OneToMany(() => Category, (category) => category.parent)
  children: Category[];

  @CreateDateColumn({ type: "timestamp" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at: Date;

  @DeleteDateColumn({ type: "timestamp", nullable: true })
  deleted_at?: Date;

  @Column({ type: "int", nullable: true })
  created_by?: number;

  @Column({ type: "int", nullable: true })
  updated_by?: number;

  @Column({ type: "int", nullable: true })
  deleted_by?: number | null;

  // products relation
  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}
