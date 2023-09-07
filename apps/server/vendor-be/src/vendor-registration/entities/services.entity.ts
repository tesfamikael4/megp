import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity({ name: 'services' })
export class ServicesEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ name: 'description' })
  description: string;
  @Column({ name: 'is_active' })
  isActive: boolean;
}
