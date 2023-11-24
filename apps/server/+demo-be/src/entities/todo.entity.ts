import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'todoes' })
export class Todo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;
}
