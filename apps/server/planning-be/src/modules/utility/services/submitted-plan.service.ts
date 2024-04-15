import { Injectable } from '@nestjs/common';

@Injectable()
export class SubmittedPlanService {
  async deepEqual(obj1, obj2) {
    if (typeof obj1 === 'object' && typeof obj2 === 'object') {
      const keys1 = Object.keys(obj1);
      const keys2 = Object.keys(obj2);

      if (keys1.length !== keys2.length) {
        return false;
      }

      for (const key of keys1) {
        if (!obj2.hasOwnProperty(key)) {
          return false;
        }
        if (!(await this.deepEqual(obj1[key], obj2[key]))) {
          return false;
        }
      }

      return true;
    } else {
      const result = obj1 === obj2;
      return result;
    }
  }
}
