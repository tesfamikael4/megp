import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SorBillOfMaterial } from 'src/entities/sor-bill-of-material.entity';
import { SorDocument } from 'src/entities/sor-document.entity';
import { SorEquipment } from 'src/entities/sor-equipment.entity';
import { SorFee } from 'src/entities/sor-fee.entity';
import { SorIncidentalCost } from 'src/entities/sor-incidental-cost.entity';
import { SorReimburseableExpense } from 'src/entities/sor-reimburseable-expense.entity';
import { SorTechnicalRequirement } from 'src/entities/sor-technical-requirement.entity';
import { SorBillOfMaterialService } from './service/sor-bill-of-material.service';
import { SorDocumentService } from './service/sor-document.service';
import { SorEquipmentService } from './service/sor-equipment.service';
import { SorFeeService } from './service/sor-fee.service';
import { SorIncidentalCostService } from './service/sor-incidental-cost.service';
import { SorReimburseableExpenseService } from './service/sor-reimburseable-expense.service';
import { SorTechnicalRequirementService } from './service/sor-technical-requirement.service';
import { SorLabor } from 'src/entities/sor-labor.entity';
import { SorLaborService } from './service/sor-labor.service';
import { SorBillOfMaterialController } from './controller/sor-bill-of-material.controller';
import { SorEquipmentController } from './controller/sor-equipments.controller';
import { SorFeeController } from './controller/sor-fee.controller';
import { SorIncidentalCostController } from './controller/sor-incidental-costs.controller';
import { SorReimburseableExpenseController } from './controller/sor-reimburseable-expense.controller';
import { SorDocumentController } from './controller/sor-document.controller';
import { SorTechnicalRequirementController } from './controller/sor-technical-requirement.controller';
import { SorLaborController } from './controller/sor-labors.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SorBillOfMaterial,
      SorDocument,
      SorEquipment,
      SorFee,
      SorIncidentalCost,
      SorReimburseableExpense,
      SorTechnicalRequirement,
      SorLabor,
    ]),
  ],
  providers: [
    SorBillOfMaterialService,
    SorDocumentService,
    SorEquipmentService,
    SorFeeService,
    SorIncidentalCostService,
    SorReimburseableExpenseService,
    SorTechnicalRequirementService,
    SorLaborService,
  ],
  controllers: [
    SorBillOfMaterialController,
    SorDocumentController,
    SorEquipmentController,
    SorFeeController,
    SorIncidentalCostController,
    SorReimburseableExpenseController,
    SorTechnicalRequirementController,
    SorLaborController,
  ],
})
export class SorModule {}
