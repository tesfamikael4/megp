import { Audit } from 'src/shared/entities';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'todoes' })
export class Todo extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;
}
