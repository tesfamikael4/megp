import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ExtraCrudService } from 'src/shared/service/extra-crud.service';
import { ItemTag } from 'src/item-master/entities/item-tag.entity';

@Injectable()
export class ExtraItemTagService extends ExtraCrudService<ItemTag> {
    constructor(
        @InjectRepository(ItemTag)
        private readonly tagRepository: Repository<ItemTag>,
    ) {
        super(tagRepository);
    }
}
