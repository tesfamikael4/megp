import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrganizationBudgetCategory } from 'src/entities/organization-budget-category.entity';
import { EntityCrudService } from 'src/shared/service';
import { Repository } from 'typeorm';

@Injectable()
export class OrganizationBudgetCategoryService extends EntityCrudService<OrganizationBudgetCategory> {
  constructor(
    @InjectRepository(OrganizationBudgetCategory)
    private readonly organizationBudgetCategoryRepository: Repository<OrganizationBudgetCategory>,
  ) {
    super(organizationBudgetCategoryRepository);
  }
}
