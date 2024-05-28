/*
https://docs.nestjs.com/providers#services
*/

import { BadRequestException, Injectable } from '@nestjs/common';
import { CronJob } from 'cron';
import { DataSource } from 'typeorm';
import { EncryptionHelperService } from './encryption-helper.service';

@Injectable()
export class SchedulerService {
  constructor(
    private dataSource: DataSource,
    private readonly encryptionHelperService: EncryptionHelperService,
  ) {}

  async scheduleWithEncryption(func, date: Date, payload: any) {
    const cronDate = new Date(date);
    if (!cronDate) throw new BadRequestException('invalid date');

    const job = new CronJob(cronDate, async () => {
      try {
        await func(this.dataSource, this.encryptionHelperService, payload);
      } catch (error) {
        console.log(error);
      }
    });
    job.start();
  }

  async schedule(func, date: Date, payload: any) {
    const cronDate = new Date(date);
    if (!cronDate) throw new BadRequestException('invalid date format');

    const job = new CronJob(cronDate, async () => {
      try {
        await func(this.dataSource, payload);
      } catch (error) {
        console.log(error);
      }
    });
    job.start();
  }
}
