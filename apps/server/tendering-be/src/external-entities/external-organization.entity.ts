import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'external_organizations', synchronize: false })
export class Organization {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;
}
