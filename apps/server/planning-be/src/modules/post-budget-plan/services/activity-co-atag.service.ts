import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ActivityCoATag } from 'src/entities';
import { ExtraCrudService } from 'src/shared/service';

@Injectable()
export class ActivityCoATagService extends ExtraCrudService<ActivityCoATag> {
  constructor(
    @InjectRepository(ActivityCoATag)
    private readonly repositoryActivityCoATag: Repository<ActivityCoATag>,
  ) {
    super(repositoryActivityCoATag);
  }
}
