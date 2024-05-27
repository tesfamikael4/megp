import { Audit } from 'src/shared/entities';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Item } from './tender-item.entity';
import { TechnicalResponsivenessAssessmentDetail } from './technical-responsiveness-assessment-detail.entity';
import { SpdBidForm } from './spd-bid-form.entity';

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
  bidFormId: string;

  @ManyToOne(() => SpdBidForm, (spd) => spd.sorTechnicalRequirements)
  @JoinColumn({ name: 'bidFormId' })
  bidForm: SpdBidForm;

  @OneToMany(
    () => TechnicalResponsivenessAssessmentDetail,
    (technicalResponsivenessAssessmentDetail) =>
      technicalResponsivenessAssessmentDetail.sorTechnicalRequirement,
  )
  @JoinColumn()
  technicalResponsivenessAssessmentDetails: TechnicalResponsivenessAssessmentDetail[];
}
