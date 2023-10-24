import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import { Audit } from 'src/shared/entities/audit.entity';

import { User } from './user.entity';
import { ContactNumber } from 'src/shared/entities/contact-number';
import { FileResponse } from 'src/shared/entities/file-response';

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
  profilePhoto: FileResponse;
  @Column({ name: 'user_id' })
  userId: string;
  @OneToOne(() => User, (emp) => emp.userProfile, {
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'userId' })
  user: User;
}
