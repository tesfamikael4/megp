import { Module } from '@nestjs/common';
import { BudgetCategoriesService } from './services/budget-categories.service';
import { BudgetCategoriesController } from './controllers/budget-categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BudgetCategory } from 'src/entities';

@Module({
  imports: [TypeOrmModule.forFeature([BudgetCategory])],
  controllers: [BudgetCategoriesController],
  providers: [BudgetCategoriesService],
})
export class BudgetCategoriesModule {}
