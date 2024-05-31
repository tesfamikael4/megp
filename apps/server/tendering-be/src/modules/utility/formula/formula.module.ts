import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Formula } from 'src/entities/formula.entity';
import { FormulaUnit } from 'src/entities/formula-unit.entity';
import { EvaluatorService } from './service/evaluator.service';
import { FormulaService } from './service/formula.service';
import { FormulaUnitService } from './service/formula-unit.service';
import { FormulaController } from './controller/formula.controller';
import { FormulaUnitController } from './controller/formula-unit.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Formula, FormulaUnit])],
  providers: [EvaluatorService, FormulaService, FormulaUnitService],
  controllers: [FormulaController, FormulaUnitController],
})
export class FormulaModule {}
