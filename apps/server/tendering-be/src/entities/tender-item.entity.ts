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
// import { SorTechnicalRequirement } from './sor-technical-requirement.entity';
// import { SorReimburseableExpense } from './sor-reimburseable-expense.entity';
// import { SorBillOfMaterial } from './sor-bill-of-material.entity';
// import { SorEquipment } from './sor-equipment.entity';
// import { SorFee } from './sor-fee.entity';
// import { SorIncidentalCost } from './sor-incidental-cost.entity';
// import { SorLabor } from './sor-labor.entity';
// import { SorDocument } from './sor-document.entity';

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
  estimatedPrice: number;

  @Column()
  estimatedPriceCurrency: string;

  @Column()
  marketPrice: number;

  @Column()
  marketPriceCurrency: string;

  @Column()
  hasBom: boolean;

  @Column({ type: 'jsonb' })
  metaData: any;

  // @OneToMany(
  //   () => SorTechnicalRequirement,
  //   (technicalRequirement) => technicalRequirement.item,
  // )
  // technicalRequirements: SorTechnicalRequirement[];

  // @OneToMany(
  //   () => SorReimburseableExpense,
  //   (reimburseableExpense) => reimburseableExpense.item,
  // )
  // reimburseableExpense: SorReimburseableExpense[];

  // @OneToMany(() => SorBillOfMaterial, (billOfMaterial) => billOfMaterial.item)
  // billOfMaterials: SorBillOfMaterial[];

  // @OneToMany(() => SorEquipment, (equipment) => equipment.item)
  // equipments: SorEquipment[];

  // @OneToMany(() => SorFee, (fee) => fee.item)
  // fees: SorFee[];

  // @OneToMany(() => SorIncidentalCost, (incidentalCost) => incidentalCost.item)
  // incidentalCosts: SorIncidentalCost[];

  // @OneToMany(() => SorLabor, (labor) => labor.item)
  // labors: SorLabor[];

  // @OneToMany(() => SorDocument, (documents) => documents.item)
  // documents: SorDocument[];
}
