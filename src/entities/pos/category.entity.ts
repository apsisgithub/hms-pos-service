import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("pos_categories")
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "int", nullable: false })
  sbu_id: number;

  @Column({ type: "uuid", unique: true })
  uuid: string;

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
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @Column({ nullable: true })
  createdById?: number;

  @Column({ nullable: true })
  updatedById?: number;

  @Column({ nullable: true, type: "int" })
  deletedById: number | null;
}
