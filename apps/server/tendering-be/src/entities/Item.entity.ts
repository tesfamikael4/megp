import { Audit } from 'src/shared/entities';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Lot } from './lot.entity';
import { TechnicalRequirement } from './technical-requirement.entity';
import { ReimburseableExpense } from './reimburseable-expense.entity';
import { BillOfMaterial } from './bill-of-material.entity';
import { Equipment } from './equipments.entity';
import { Fee } from './fee.entity';
import { IncidentalCost } from './incidental-costs.entity';
import { Labor } from './labor.entity';
import { Document } from './document.entity';

@Entity({ name: 'items' })
export class Item extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  lotId: string;

  @ManyToOne(() => Lot, (lot) => lot.items)
  @JoinColumn()
  lot: Lot;

  @Column()
  itemCode: string;

  @Column()
  itemType: string;

  @Column()
  procurementCategory: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  quantity: number;

  @Column()
  unitOfMeasure: string;

  @Column()
  estimatedPrice: string;

  @Column()
  estimatedPriceCurrency: string;

  @Column()
  marketPrice: string;

  @Column()
  marketPriceCurrency: string;

  @Column()
  hasBom: boolean;

  @Column({ type: 'jsonb' })
  metaData: any;

  @OneToMany(
    () => TechnicalRequirement,
    (technicalRequirement) => technicalRequirement.item,
  )
  technicalRequirements: TechnicalRequirement[];

  @OneToMany(
    () => ReimburseableExpense,
    (reimburseableExpense) => reimburseableExpense.item,
  )
  reimburseableExpense: ReimburseableExpense[];

  @OneToMany(() => BillOfMaterial, (billOfMaterial) => billOfMaterial.item)
  billOfMaterials: BillOfMaterial[];

  @OneToMany(() => Equipment, (equipment) => equipment.item)
  equipments: Equipment[];

  @OneToMany(() => Fee, (fee) => fee.item)
  fees: Fee[];

  @OneToMany(() => IncidentalCost, (incidentalCost) => incidentalCost.item)
  incidentalCosts: IncidentalCost[];

  @OneToMany(() => Labor, (labor) => labor.item)
  labors: Labor[];

  @OneToMany(() => Document, (documents) => documents.item)
  documents: Document[];
}
