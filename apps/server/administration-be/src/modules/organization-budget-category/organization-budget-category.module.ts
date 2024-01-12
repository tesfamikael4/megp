import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationBudgetCategoryController } from './controller/organization-budget-category.controller';
import { OrganizationBudgetCategoryService } from './service/organization-budget-category.service';
import { OrganizationBudgetCategory } from 'src/entities/organization-budget-category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrganizationBudgetCategory])],
  controllers: [OrganizationBudgetCategoryController],
  providers: [OrganizationBudgetCategoryService],
})
export class OrganizationBudgetCategoryModule {}
