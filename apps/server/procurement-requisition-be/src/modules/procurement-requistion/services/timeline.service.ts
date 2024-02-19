import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Timeline } from 'src/entities';
import { ExtraCrudService } from 'src/shared/service';
import { Repository } from 'typeorm';

@Injectable()
export class TimelineService extends ExtraCrudService<Timeline> {
  constructor(
    @InjectRepository(Timeline)
    repositoryTimeline: Repository<Timeline>,
  ) {
    super(repositoryTimeline);
  }
}
