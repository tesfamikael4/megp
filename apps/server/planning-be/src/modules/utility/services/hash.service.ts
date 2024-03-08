import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';

@Injectable()
export class HashService {
  hashData(data: any) {
    return createHash('sha-256').update(JSON.stringify(data)).digest('hex');
  }

  hashMatch(data: any, hash: string): boolean {
    const originalHash = this.hashData(data);
    return originalHash === hash;
  }
}
