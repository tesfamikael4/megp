import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrganizationBudgetCategory } from 'src/entities/organization-budget-category.entity';
import { EntityCrudService, ExtraCrudService } from 'src/shared/service';
import { Repository } from 'typeorm';
import { OrganizationBudgetCategoryCreateDto } from '../dto/organization-budget-category.dto';

@Injectable()
export class OrganizationBudgetCategoryService extends ExtraCrudService<OrganizationBudgetCategory> {
  constructor(
    @InjectRepository(OrganizationBudgetCategory)
    private readonly organizationBudgetCategoryRepository: Repository<OrganizationBudgetCategory>,
  ) {
    super(organizationBudgetCategoryRepository);
  }

  async bulkCreate(
    budgetData: OrganizationBudgetCategoryCreateDto,
  ): Promise<OrganizationBudgetCategory[]> {
    console.log({ budgetData });

    // remove all existing budget for this organization, if it exist remove all

    try {
      const existingBudgets =
        await this.organizationBudgetCategoryRepository.find({
          where: { organizationId: budgetData.organizationId },
        });
      await this.organizationBudgetCategoryRepository.remove(existingBudgets);

      // // Remove existing budgets for the specified organization
      // await this.organizationBudgetCategoryRepository.delete({
      //   organizationId: budgetData.organizationId,
      // });

      const budgetList = budgetData.budgetCategoryId.map((budgetCategoryId) => {
        return {
          budgetCategoryId,
          organizationId: budgetData.organizationId,
        };
      });

      console.log('Budget List', budgetList);

      const budgets =
        this.organizationBudgetCategoryRepository.create(budgetList);
      await this.organizationBudgetCategoryRepository.save(budgets);
      return budgets;
    } catch (error) {
      throw new Error(`Failed to create budgets: ${error.message}`);
    }
  }
}
