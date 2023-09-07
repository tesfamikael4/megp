import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ApplicationEntity } from './application.entity';
@Entity({ name: 'services' })
export class ServicesEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ name: 'description' })
  description: string;
  @Column({ name: 'is_active' })
  isActive: boolean;

  @OneToMany(() => ApplicationEntity, (app) => app.service)
  applications: ApplicationEntity[];
}
