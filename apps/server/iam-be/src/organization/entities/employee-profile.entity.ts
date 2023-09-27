import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import { Audit } from '../../shared/entities/audit.entity';

import { ContactNumber } from '../../shared/domain/contact-number';
import { FileResponseDto } from '../../shared/domain/file-response.dto';
import { User } from './employee.entity';

@Entity({ name: 'user_profiles' })
export class UserProfile extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ nullable: true })
  country: string;
  @Column({ nullable: true })
  region: string;
  @Column({
    nullable: true,
  })
  zoneOrSubCity: string;
  @Column({ nullable: true })
  city: string;
  @Column({ nullable: true })
  woreda: string;
  @Column({ nullable: true })
  street: string;
  @Column({
    nullable: true,
  })
  houseNumber: string;
  @Column({ type: 'jsonb', nullable: true })
  mobileNumber: ContactNumber;
  @Column({ type: 'jsonb', nullable: true })
  telephone: ContactNumber;
  @Column({ type: 'jsonb', nullable: true })
  fax: ContactNumber;
  @Column({ nullable: true })
  postalCode: string;
  @Column({ type: 'jsonb', nullable: true })
  profilePhoto: FileResponseDto;
  @Column({ name: 'user_id' })
  userId: string;
  @OneToOne(() => User, (emp) => emp.userProfile, {
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'userId' })
  user: User;
}
