import {
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    Column,
  } from "typeorm";
  
  export abstract class BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;
  
    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    created_at: Date;
  
    @Column({ type: "int", nullable: true })
    created_by: number;
  
    @UpdateDateColumn({name: 'updated_at', type: "timestamp" })
    updated_at: Date;
  
    @Column({ type: "int", nullable: true })
    updated_by: number;
  
    @DeleteDateColumn({ name: 'deleted_at',type: "timestamp" })
    deleted_at: Date;
  
    @Column({ type: "int", nullable: true })
    deleted_by: number;
  }
  