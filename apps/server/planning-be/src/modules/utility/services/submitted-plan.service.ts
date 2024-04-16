import { Injectable } from '@nestjs/common';

type ComparisonResult =
  | 'Not modified'
  | { addedKeys: any[]; removedKeys: any[]; modifiedKeys: any[] };

@Injectable()
export class SubmittedPlanService {
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

  async deepEqual(obj1, obj2, path = ''): Promise<ComparisonResult> {
    if (typeof obj1 !== 'object' || typeof obj2 !== 'object') {
      throw new Error('Both arguments must be objects');
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
        const result = await this.deepEqual(obj1[key], obj2[key], newPath);
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
}
