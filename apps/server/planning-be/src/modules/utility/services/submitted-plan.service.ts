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
      where: { objectId: id },
      select: {
        id: true,
        version: true,
      },
    });
  }
  async getPreviousVersions(id: string): Promise<SubmittedPlan[]> {
    const plan = await this.repositorySubmittedPlan.findOne({
      where: {
        id,
      },
      select: {
        id: true,
        version: true,
      },
    });
    return await this.repositorySubmittedPlan.find({
      where: {
        objectId: plan.objectId,
        version: LessThan(plan.version),
      },
      select: {
        id: true,
        version: true,
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

  async comparePlan(
    toBeCompareId: string,
    compareWithId: string,
    modifiedId: string,
  ) {
    const [toBeCompare, compareWith] = await Promise.all([
      this.repositorySubmittedPlan.findOne({
        where: {
          id: toBeCompareId,
        },
        select: {
          plan: true,
        },
      }),
      this.repositorySubmittedPlan.findOne({
        where: {
          id: compareWithId,
        },
        select: {
          plan: true,
        },
      }),
    ]);

    const modifiedToCompare = toBeCompare.plan.data.find(
      (x) => x.id == modifiedId,
    );
    const modifiedCompareWith = compareWith.plan.data.find(
      (x) => x.id == modifiedId,
    );

    // const transformedToCompare = this.instanceToPlainExclude(modifiedToCompare, {
    //   exclude: ['createdAt', 'updatedAt', 'deletedAt'],
    // });

    // const transformedCompareWith = this.instanceToPlainExclude(modifiedCompareWith, {
    //   exclude: ['createdAt', 'updatedAt', 'deletedAt'],
    // });
    // const plan = await this.compareJson(transformedToCompare, transformedCompareWith)
    const plan = await this.compareJson(modifiedCompareWith, modifiedToCompare);
    return {
      modifiedToCompare,
      modifiedCompareWith,
      modifiedKeys: plan !== 'Not modified' && plan,
    };
    // return {
    //   modifiedToCompare: transformedToCompare,
    //   modifiedCompareWith: transformedToCompare,
    //   modifiedKeys: plan !== 'Not modified' && plan.modifiedKeys
    // }
  }
  // async compareJson(obj1, obj2, path = '', parentId?: string): Promise<ComparisonResult> {
  //   if (typeof obj1 !== 'object' || typeof obj2 !== 'object') {
  //     throw new Error('Both arguments must be objects');
  //   }
  //   if (obj1 === null && obj2 == null) {
  //     return 'Not modified';
  //   }

  //   const keys1 = Object.keys(obj1);
  //   const keys2 = Object.keys(obj2);

  //   const addedKeys: any[] = [];
  //   const removedKeys: any[] = [];
  //   const modifiedKeys: any[] = [];

  //   // Find added and modified keys
  //   for (const key of keys2) {
  //     const newPath = path ? `${path}.${key}` : key;
  //     const newParentId = parentId || obj2[key]?.id; // Get the ID from obj2 or use the current parent ID

  //     if (!keys1.includes(key)) {
  //       addedKeys.push(newPath);
  //     } else if (
  //       typeof obj1[key] === 'object' &&
  //       typeof obj2[key] === 'object'
  //     ) {
  //       const obj = obj1[key]
  //       const objId = obj.id

  //       if (Array.isArray(obj1)) {
  //         for (const obj of obj1) {
  //           const objId = obj.id;
  //           const filteredObject = Object.entries(obj2).find(([key, value]) => (value as { id: string })?.id === objId);

  //           if (filteredObject) {
  //             const [key, value] = filteredObject;
  //             filteredObject[key] = value;
  //           }
  //           const result = await this.compareJson(obj, filteredObject, newPath);
  //           if (result !== 'Not modified') {
  //             addedKeys.push(...result.addedKeys);
  //             removedKeys.push(...result.removedKeys);
  //             modifiedKeys.push(...result.modifiedKeys);
  //           }
  //         }
  //       } else {

  //         const result = await this.compareJson(obj, obj2, newPath);
  //         if (result !== 'Not modified') {
  //           addedKeys.push(...result.addedKeys);
  //           removedKeys.push(...result.removedKeys);
  //           modifiedKeys.push(...result.modifiedKeys);
  //         }
  //       }

  //     } else if (obj1[key] !== obj2[key]) {
  //       modifiedKeys.push(newPath);
  //     }
  //   }

  //   for (const key of keys1) {
  //     const newPath = path ? `${path}.${key}` : key;
  //     if (!keys2.includes(key)) {
  //       removedKeys.push(newPath);
  //     }
  //   }

  //   if (
  //     addedKeys.length > 0 ||
  //     removedKeys.length > 0 ||
  //     modifiedKeys.length > 0
  //   ) {
  //     return { addedKeys, removedKeys, modifiedKeys };
  //   } else {
  //     return 'Not modified';
  //   }
  // }

  async compareJson(
    obj1,
    obj2,
    path = '',
    parentId?: string,
  ): Promise<ComparisonResult> {
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
      const newParentId = parentId || obj2[key]?.id; // Get the ID from obj2 or use the current parent ID

      if (!keys1.includes(key)) {
        addedKeys.push(newPath);
      } else if (Array.isArray(obj1[key]) && Array.isArray(obj2[key])) {
        const allHaveId1 = obj1[key].every((item) => item.hasOwnProperty('id'));
        const allHaveId2 = obj2[key].every((item) => item.hasOwnProperty('id'));

        if (allHaveId1 && allHaveId2) {
          const sorted1 = obj1[key]
            .slice()
            .sort((a, b) => a.id.localeCompare(b.id))
            .map(({ id, ...rest }) => rest);
          const sorted2 = obj2[key]
            .slice()
            .sort((a, b) => a.id.localeCompare(b.id))
            .map(({ id, ...rest }) => rest);

          if (JSON.stringify(sorted1) !== JSON.stringify(sorted2)) {
            const result = await this.compareJson(sorted2, sorted1, newPath);
            if (result !== 'Not modified') {
              addedKeys.push(...result.addedKeys);
              removedKeys.push(...result.removedKeys);
              modifiedKeys.push(...result.modifiedKeys);
            }
          }
        } else {
          if (JSON.stringify(obj1[key]) !== JSON.stringify(obj2[key])) {
            modifiedKeys.push(newPath);
          }
        }
      } else if (
        typeof obj1[key] === 'object' &&
        typeof obj2[key] === 'object'
      ) {
        const result = await this.compareJson(obj2[key], obj1[key], newPath);
        if (result !== 'Not modified') {
          addedKeys.push(...result.addedKeys);
          removedKeys.push(...result.removedKeys);
          modifiedKeys.push(...result.modifiedKeys);
        }
      } else if (obj1[key] !== obj2[key]) {
        if (key == 'id') {
          return 'Not modified';
        }
        modifiedKeys.push(newPath);
      }
    }

    for (const key of keys1) {
      const newPath = path ? `${path}.${key}` : key;
      if (!keys2.includes(key)) {
        removedKeys.push(newPath);
      }
    }

    const modifiedKeysWithoutTimestamps = modifiedKeys.filter(
      (key) => !key.endsWith('updatedAt') && !key.endsWith('createdAt'),
    );

    if (
      addedKeys.length > 0 ||
      removedKeys.length > 0 ||
      modifiedKeysWithoutTimestamps.length > 0
    ) {
      return {
        addedKeys,
        removedKeys,
        modifiedKeys: modifiedKeysWithoutTimestamps,
      };
    } else {
      return 'Not modified';
    }
  }

  async compare(
    toBeCompareId: string,
    compareWithId: string,
  ): Promise<ComparisonResult> {
    const [toBeCompare, compareWith] = await Promise.all([
      this.repositorySubmittedPlan.findOne({
        where: {
          id: toBeCompareId,
        },
        select: {
          plan: true,
        },
      }),
      this.repositorySubmittedPlan.findOne({
        where: {
          id: compareWithId,
        },
        select: {
          plan: true,
        },
      }),
    ]);
    const transformedToCompare = this.instanceToPlainExclude(toBeCompare.plan, {
      exclude: ['createdAt', 'updatedAt', 'deletedAt'],
    });

    const transformedCompareWith = this.instanceToPlainExclude(
      compareWith.plan,
      {
        exclude: ['createdAt', 'updatedAt', 'deletedAt'],
      },
    );

    return await this.deepEqual(
      Object.values(toBeCompare.plan.data),
      Object.values(compareWith.plan.data),
    );
  }
  async deepEqual(list1: any[], list2: any[]): Promise<ComparisonResult> {
    const addedKeys: responseObject[] = [];
    const removedKeys: responseObject[] = [];
    const modifiedKeys: responseObject[] = [];

    const map1 = new Map(list1.map((item) => [item.id, item]));
    const map2 = new Map(list2.map((item) => [item.id, item]));

    // const map1 = list1;
    // const map2 = list2;
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
        const result = await this.compareJson(map1.get(id), item);
        if (result !== 'Not modified') {
          // return result;
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

  instanceToPlainExclude(
    obj: Record<string, any>,
    options: { exclude?: string[] } = {},
  ): Record<string, any> {
    const plain: Record<string, any> = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key) && !options.exclude.includes(key)) {
        plain[key] =
          typeof obj[key] === 'object' && obj[key] !== null
            ? this.instanceToPlainExclude(obj[key], options) // Recursively convert nested objects
            : obj[key];
      }
    }
    return plain;
  }
}
