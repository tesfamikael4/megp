import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrganizationBudgetCategory } from 'src/entities/organization-budget-category.entity';
import { ExtraCrudService } from 'src/shared/service';
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
      // remove existing organization budgets
      await this.organizationBudgetCategoryRepository.delete({
        organizationId: budgetData.organizationId,
      });

      const budgetList = budgetData.budgetCategoryId.map((budgetCategoryId) => {
        return {
          budgetCategoryId,
          organizationId: budgetData.organizationId,
        };
      });

      const budgets =
        this.organizationBudgetCategoryRepository.create(budgetList);
      await this.organizationBudgetCategoryRepository.save(budgets);
      return budgets;
    } catch (error) {
      throw new Error(`Failed to create budgets: ${error.message}`);
    }
  }

  async getAllBudgetCategories(): Promise<OrganizationBudgetCategory[]> {
    try {
      const budgets = await this.organizationBudgetCategoryRepository.find();
      return budgets;
    } catch (error) {
      throw new Error(`Failed to get budgets: ${error.message}`);
    }
  }

  async getBudgetCategoryByOrganizationId(
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

  async deleteBudgetCategories(organizationId: string): Promise<any> {
    try {
      const budgets = await this.organizationBudgetCategoryRepository.delete({
        organizationId: organizationId,
      });

      return {
        message: `Successfully deleted ${budgets.affected} budgets inside ${organizationId} organization id .`,
      };
    } catch (error) {
      throw new Error(`Failed to delete budgets: ${error.message}`);
    }
  }
}
