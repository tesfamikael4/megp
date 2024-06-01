import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormulaUnit } from 'src/entities/formula-unit.entity';
import { EvaluatorService } from './service/evaluator.service';
import { FormulaUnitService } from './service/formula-unit.service';
import { FormulaUnitController } from './controller/formula-unit.controller';

@Module({
  imports: [TypeOrmModule.forFeature([FormulaUnit])],
  providers: [EvaluatorService, FormulaUnitService],
  controllers: [FormulaUnitController],
})
export class FormulaModule {}
