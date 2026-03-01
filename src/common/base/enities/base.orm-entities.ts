import { Column, CreateDateColumn, JoinTable, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export abstract class BaseOrmEntity  {
 @PrimaryGeneratedColumn('increment')
  id: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}