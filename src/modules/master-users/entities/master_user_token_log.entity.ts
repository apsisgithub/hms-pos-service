import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
} from "typeorm";

@Entity({ name: "token_log" })
export class UserTokenLog {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    user_id: number;

    @Column()
    user_type: number;

    @Column()
    refreshtoken: string;

    @Column()
    refreshtokenexpires: string;

    @CreateDateColumn({ type: "timestamp" })
    created_at: Date;

    @Column()
    ip_address: string;
}
