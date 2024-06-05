import { Module } from '@nestjs/common';
import { BudgetCategoriesService } from './services/budget-categories.service';
import { BudgetCategoriesController } from './controllers/budget-categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BudgetCategory } from 'src/entities';
import { LogController } from './controllers/log.controller';

@Module({
  imports: [TypeOrmModule.forFeature([BudgetCategory])],
  controllers: [BudgetCategoriesController, LogController],
  providers: [BudgetCategoriesService],
})
export class BudgetCategoriesModule {}
