import { Audit } from 'src/shared/entities';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Item } from './tender-item.entity';

@Entity({ name: 'sor_technical_requirements' })
export class SorTechnicalRequirement extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  itemId: string;

  @ManyToOne(() => Item, (item) => item.technicalRequirements)
  @JoinColumn({ name: 'itemId' })
  item: Item;

  @Column()
  sorType: string;

  @Column()
  category: string;

  @Column()
  requirement: string;

  @Column()
  requirementCondition: string;

  @Column()
  requirementType: string;

  @Column()
  formLink: string;
}
