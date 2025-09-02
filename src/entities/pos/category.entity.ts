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
} from "typeorm";

@Entity("pos_categories")
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "uuid", unique: true })
  @Generated("uuid")
  uuid: string;

  @Column({ type: "int", nullable: false })
  sbu_id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  slug: string;

  @Column({ nullable: true })
  picture: string;

  @ManyToOne(() => Category, (category) => category.children, {
    onDelete: "CASCADE",
    nullable: true,
  })
  parent: Category;

  @OneToMany(() => Category, (category) => category.parent)
  children: Category[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at?: Date;

  @Column({ nullable: true })
  created_by?: number;

  @Column({ nullable: true })
  updated_by?: number;

  @Column({ nullable: true, type: "int" })
  deleted_by: number | null;
}
