import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormulaUnit } from 'src/entities/formula-unit.entity';
import { EvaluatorService } from './service/evaluator.service';
import { FormulaUnitService } from './service/formula-unit.service';
import { FormulaUnitController } from './controller/formula-unit.controller';
import { FormulaImplementationService } from './service/formula-implementation.service';
import { FormulaImplementationController } from './controller/formula-implementation.controller';
import { FormulaImplementation } from 'src/entities/formula-implementation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FormulaUnit, FormulaImplementation])],
  providers: [
    EvaluatorService,
    FormulaUnitService,
    FormulaImplementationService,
  ],
  controllers: [FormulaUnitController, FormulaImplementationController],
})
export class FormulaModule { }
