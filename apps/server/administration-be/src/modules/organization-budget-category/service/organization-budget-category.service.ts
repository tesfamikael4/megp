import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrganizationBudgetCategory } from 'src/entities/organization-budget-category.entity';
import { EntityCrudService } from 'src/shared/service';
import { Repository } from 'typeorm';
import { BulkBudgetDto } from '../dto/organization-budget-category.dto';

@Injectable()
export class OrganizationBudgetCategoryService extends EntityCrudService<OrganizationBudgetCategory> {
  constructor(
    @InjectRepository(OrganizationBudgetCategory)
    private readonly organizationBudgetCategoryRepository: Repository<OrganizationBudgetCategory>,
  ) {
    super(organizationBudgetCategoryRepository);
  }

  async bulkCreate(budgetData: BulkBudgetDto): Promise<BulkBudgetDto> {
    const budget = this.organizationBudgetCategoryRepository.create(
      budgetData.budgetCategoryList as any,
    );
    await this.organizationBudgetCategoryRepository.save(budget);

    return budgetData;
  }
}
