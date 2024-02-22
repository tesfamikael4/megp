import { Audit } from 'src/shared/entities';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Item } from './Item.entity';

@Entity({ name: 'technical_requirements' })
export class TechnicalRequirement extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  itemId: string;

  @ManyToOne(() => Item, (item) => item.technicalRequirements)
  @JoinColumn()
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
