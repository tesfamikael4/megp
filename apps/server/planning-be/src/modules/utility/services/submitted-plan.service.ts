import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubmittedPlan } from 'src/entities/submitted-plan.entity';
import { EntityCrudService } from 'src/shared/service';
import { LessThan, Repository } from 'typeorm';

type ComparisonResult =
  | 'Not modified'
  | { addedKeys: any[]; removedKeys: any[]; modifiedKeys: any[] };

type responseObject = {
  id: string;
  name: string;
  description: string;
  procurementReference: string;
  estimatedAmount: any;
};
@Injectable()
export class SubmittedPlanService extends EntityCrudService<SubmittedPlan> {
  constructor(
    @InjectRepository(SubmittedPlan)
    private readonly repositorySubmittedPlan: Repository<SubmittedPlan>,
  ) {
    super(repositorySubmittedPlan);
  }

  async getByObjectId(id: string): Promise<SubmittedPlan[]> {
    return await this.repositorySubmittedPlan.find({
      where: { id: id },
      relations: ['plan'],
    });
  }
  async getPreviousVersions(id: string): Promise<SubmittedPlan[]> {
    const plan = await this.repositorySubmittedPlan.findOne({
      where: {
        id,
      },
    });
    return await this.repositorySubmittedPlan.find({
      where: {
        objectId: plan.objectId,
        version: LessThan(plan.version),
      },
    });
  }
  // async deepEqual(obj1, obj2) {
  //   if (typeof obj1 === 'object' && typeof obj2 === 'object') {
  //     const keys1 = Object.keys(obj1);
  //     const keys2 = Object.keys(obj2);

  //     if (keys1.length !== keys2.length) {
  //       return false;
  //     }

  //     for (const key of keys1) {
  //       if (!obj2.hasOwnProperty(key)) {
  //         return false;
  //       }
  //       if (!(await this.deepEqual(obj1[key], obj2[key]))) {
  //         return false;
  //       }
  //     }

  //     return true;
  //   } else {
  //     const result = obj1 === obj2;
  //     return result;
  //   }
  // }

  async compareJson(obj1, obj2, path = ''): Promise<ComparisonResult> {
    if (typeof obj1 !== 'object' || typeof obj2 !== 'object') {
      throw new Error('Both arguments must be objects');
    }
    if (obj1 === null && obj2 == null) {
      return 'Not modified';
    }

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    const addedKeys: any[] = [];
    const removedKeys: any[] = [];
    const modifiedKeys: any[] = [];

    // Find added and modified keys
    for (const key of keys2) {
      const newPath = path ? `${path}.${key}` : key;
      if (!keys1.includes(key)) {
        addedKeys.push(newPath);
      } else if (
        typeof obj1[key] === 'object' &&
        typeof obj2[key] === 'object'
      ) {
        const result = await this.compareJson(obj1[key], obj2[key], newPath);
        if (result !== 'Not modified') {
          addedKeys.push(...result.addedKeys);
          removedKeys.push(...result.removedKeys);
          modifiedKeys.push(...result.modifiedKeys);
        }
      } else if (obj1[key] !== obj2[key]) {
        modifiedKeys.push(newPath);
      }
    }

    // Find removed keys
    for (const key of keys1) {
      const newPath = path ? `${path}.${key}` : key;
      if (!keys2.includes(key)) {
        removedKeys.push(newPath);
      }
    }

    if (
      addedKeys.length > 0 ||
      removedKeys.length > 0 ||
      modifiedKeys.length > 0
    ) {
      return { addedKeys, removedKeys, modifiedKeys };
    } else {
      return 'Not modified';
    }
  }

  async deepEqual(list1: any[], list2: any[]): Promise<ComparisonResult> {
    const addedKeys: responseObject[] = [];
    const removedKeys: responseObject[] = [];
    const modifiedKeys: responseObject[] = [];

    const map1 = new Map(list1.map((item) => [item.id, item]));
    const map2 = new Map(list2.map((item) => [item.id, item]));

    for (const [id, item] of map2) {
      if (!map1.has(id)) {
        const added = list2.find((x) => x.id == id);
        addedKeys.push({
          id: added.id,
          name: added.name,
          description: added.description,
          procurementReference: added.procurementReference,
          estimatedAmount: added.estimatedAmount,
        });
      } else {
        const result = await this.compareJson(item, map1.get(id));
        if (result !== 'Not modified') {
          const modified = list2.find((x) => x.id == id);
          modifiedKeys.push({
            id: modified.id,
            name: modified.name,
            description: modified.description,
            procurementReference: modified.procurementReference,
            estimatedAmount: modified.estimatedAmount,
          });
        }
      }
    }

    for (const [id, item] of map1) {
      if (!map2.has(id)) {
        const removed = list1.find((x) => x.id == id);
        removedKeys.push({
          id: removed.id,
          name: removed.name,
          description: removed.description,
          procurementReference: removed.procurementReference,
          estimatedAmount: removed.estimatedAmount,
        });
      }
    }

    if (
      addedKeys.length > 0 ||
      removedKeys.length > 0 ||
      modifiedKeys.length > 0
    ) {
      return { addedKeys, removedKeys, modifiedKeys };
    } else {
      return 'Not modified';
    }
  }
}
