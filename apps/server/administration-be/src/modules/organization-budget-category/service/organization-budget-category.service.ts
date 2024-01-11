import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrganizationBudgetCategory } from 'src/entities/organization-budget-category.entity';
import { EntityCrudService, ExtraCrudService } from 'src/shared/service';
import { Repository } from 'typeorm';
import { OrganizationBudgetCategoryCreateDto } from '../dto/organization-budget-category.dto';

// this code adds a budget category to an organization, but the budget category should not be duplicated within the same organization. However, the same budget category can be assigned to another organization. If there's a new organization and budget category to be added, the code should handle that as well.

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
    try {
      // remove existing organization
      await this.organizationBudgetCategoryRepository.delete({
        organizationId: budgetData.organizationId,
      });

      const budgetList = budgetData.budgetCategoryId.map((budgetCategoryId) => {
        return {
          budgetCategoryId,
          organizationId: budgetData.organizationId,
        };
      });

      for (const budget of budgetList) {
        const existingBudget =
          await this.organizationBudgetCategoryRepository.findOne({
            where: {
              organizationId: budget.organizationId,
              budgetCategoryId: budget.budgetCategoryId,
            },
          });

        if (existingBudget) {
          throw new ConflictException(
            `Budget category ${budget.budgetCategoryId} already exists for organization ${budget.organizationId}`,
          );
        }
      }

      console.log('Budget List', budgetList);

      const budgets =
        this.organizationBudgetCategoryRepository.create(budgetList);
      await this.organizationBudgetCategoryRepository.save(budgets);
      return budgets;
    } catch (error) {
      throw new Error(`Failed to create budgets: ${error.message}`);
    }
  }

  async getBudgetCategories(
    organizationId: string,
  ): Promise<OrganizationBudgetCategory[]> {
    try {
      const budgets = await this.organizationBudgetCategoryRepository.find({
        where: { organizationId: organizationId },
      });
      return budgets;
    } catch (error) {
      throw new Error(`Failed to get budgets: ${error.message}`);
    }
  }

  // async getBudgetCategoriesByBudgetId(budgetId: string): Promise<OrganizationBudgetCategory[]> {
  //   try {
  //     const budgets = await this.organizationBudgetCategoryRepository.find({
  //       where: { budgetCategoryId: budgetId },
  //     });
  //     return budgets;
  //   } catch (error) {
  //     throw new Error(`Failed to get budgets: ${error.message}`);
  //   }
  // }
}
