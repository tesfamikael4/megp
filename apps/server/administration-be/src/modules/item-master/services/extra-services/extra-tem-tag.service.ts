import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
// import { ItemTag } from 'src/entities/item-tag.entity';
import { ExtraCrudService } from 'src/shared/service/extra-crud.service';
import { ItemTag } from 'src/entities/item-tag.entity';
import { Tag } from 'src/entities/tag.entity';

@Injectable()
export class ExtraItemTagService extends ExtraCrudService<Tag> {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {
    super(tagRepository);
  }
}
