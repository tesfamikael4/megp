import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ProcurementRequisition } from 'src/entities';
import { EntityCrudService } from 'src/shared/service';
import axios from 'axios';

const planning_url = process.env.PLANNING_API ?? 'planning/api/';
const xApiKey = process.env.X_API_KEY ?? '25bc1622e5fb42cca3d3e62e90a3a20f';

@Injectable()
export class ProcurementRequisitionService extends EntityCrudService<ProcurementRequisition> {
  constructor(
    @InjectRepository(ProcurementRequisition)
    private readonly repositoryProcurementRequisition: Repository<ProcurementRequisition>,
  ) {
    super(repositoryProcurementRequisition);
  }

  async create(itemData: any, req?: any): Promise<ProcurementRequisition> {
    return super.create(itemData, req);
  }

  async annualProcurementPlan(q: string) {
    const url = planning_url + 'post-budget-plans/get-with-app';
    const response = await axios.get(url, {
      headers: {
        'X-API-KEY': xApiKey,
      },
      params: { q },
    });

    return response.data;
  }
}
