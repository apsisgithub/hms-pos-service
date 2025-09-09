import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("user_outlets")
export class UserOutlet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  outlet_id: number;
}
