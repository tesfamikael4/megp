import { Injectable } from '@nestjs/common';
import { SavedNotice } from 'src/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExtraCrudService } from 'megp-shared-be';

@Injectable()
export class SavedNoticeService extends ExtraCrudService<SavedNotice> {
  constructor(
    @InjectRepository(SavedNotice)
    private readonly savedNoticeRepository: Repository<SavedNotice>,
  ) {
    super(savedNoticeRepository);
  }

  async create(itemData: any, req?: any): Promise<any> {
    const item = this.savedNoticeRepository.create(itemData);
    await this.savedNoticeRepository.upsert(item, ['bidderId', 'noticeId']);
    return item;
  }
}
