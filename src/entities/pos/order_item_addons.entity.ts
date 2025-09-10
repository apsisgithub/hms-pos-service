import { ProductAddon } from "src/entities/pos/product_addons.entity";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { OrderItem } from "./order_items.entity";
import { Product } from "./products.entity";

@Entity("pos_order_item_addons")
export class OrderItemAddon {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "int" })
  order_item_id: number;

  @Column({ type: "int" })
  product_id: number;

  @Column({ type: "int" })
  product_addon_id: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  price: number;

  @ManyToOne(() => ProductAddon, (addon) => addon.product, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "product_addon_id" })
  productAddon: Product;

  @ManyToOne(() => Product, (product) => product.addons, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "product_id" })
  product: Product;

  @ManyToOne(() => OrderItem, (item) => item.addons, { onDelete: "CASCADE" })
  @JoinColumn({ name: "order_item_id" })
  orderItem: OrderItem;
}
