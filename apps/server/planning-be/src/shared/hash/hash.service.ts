import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';

@Injectable()
export class HashService {
  hashData(data: any) {
    const transformedData = this.instanceToPlainExclude(data, {
      exclude: ['createdAt', 'updatedAt', 'deletedAt'],
    });
    return createHash('sha-256')
      .update(JSON.stringify(transformedData))
      .digest('hex');
  }

  hashMatch(data: any, hash: string): boolean {
    const originalHash = this.hashData(data);
    return originalHash === hash;
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
