import { Audit } from 'src/shared/entities';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Item } from './item.entity';

@Entity({ name: 'todoes' })
export class Todo extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @OneToMany(() => Item, (securityQuestion) => securityQuestion.todo, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  items: Item[];
}
