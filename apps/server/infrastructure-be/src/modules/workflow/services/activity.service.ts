import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Activity } from 'src/entities/activity.entity';
import {
  CollectionQuery,
  DataResponseFormat,
  ExtraCrudOptions,
  ExtraCrudService,
  FilterOperators,
  QueryConstructor,
} from 'megp-shared-be';

@Injectable()
export class ActivityService extends ExtraCrudService<Activity> {
  constructor(
    @InjectRepository(Activity)
    private readonly repositoryActivity: Repository<Activity>,
  ) {
    super(repositoryActivity);
  }
  async create(itemData: any, req?: any): Promise<any> {
    if (req?.user?.organization) {
      itemData.organizationId = req.user.organization.id;
    }
    itemData.name = itemData.title.split(' ').join('');
    const item = this.repositoryActivity.create(itemData);
    await this.repositoryActivity.insert(item);
    return item;
  }

  async findByName(
    name: string,
    query: CollectionQuery,
    extraCrudOptions: ExtraCrudOptions,
    req?: any,
  ) {
    // query.includes.push('workflow');

    // query.where.push([
    //   {
    //     column: 'workflow.name',
    //     value: name,
    //     operator: FilterOperators.EqualTo,
    //   },
    // ]);
    const dataQuery = QueryConstructor.constructQuery<Activity>(
      this.repositoryActivity,
      query,
    )
      .leftJoin('activities.workflow', 'workflow')
      .andWhere('workflow.name = :name', { name });
    const response = new DataResponseFormat<Activity>();
    if (query.count) {
      response.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      response.total = total;
      response.items = result;
    }
    return response;
  }

  async findAllActivities(
    query: CollectionQuery,
    extraCrudOptions: ExtraCrudOptions,
    req?: any,
  ) {
    const dataQuery = QueryConstructor.constructQuery<Activity>(
      this.repositoryActivity,
      query,
    );
    const response = new DataResponseFormat<Activity>();
    if (query.count) {
      response.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      response.total = total;
      response.items = result;
    }
    return response;
  }
}
