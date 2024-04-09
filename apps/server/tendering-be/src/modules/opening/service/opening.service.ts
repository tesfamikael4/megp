import { InjectRepository } from '@nestjs/typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { ExtraCrudService } from 'src/shared/service';
import { Opening } from 'src/entities/opening.entity';
import { CreateOpeningDto } from '../dto/opening.dto';
import { REQUEST } from '@nestjs/core';
import { ENTITY_MANAGER_KEY } from 'src/shared/interceptors';
import { Tender } from 'src/entities';

@Injectable()
export class OpeningService extends ExtraCrudService<Opening> {
  constructor(
    @InjectRepository(Opening)
    private readonly openingRepository: Repository<Opening>,

    @Inject(REQUEST) private request: Request,
  ) {
    super(openingRepository);
  }

  async create(itemData: Opening, req?: any): Promise<any> {
    if (req?.user?.organization) {
      itemData.organizationId = req.user.organization.id;
      itemData.organizationName = req.user.organization.name;
    }
    const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];
    const tender = await manager.getRepository(Tender).findOne({
      where: {
        id: itemData.tenderId,
      },
      relations: {
        bdsSubmission: true,
      },
    });
    itemData.openingType = tender.bdsSubmission.envelopType;
    const item = this.openingRepository.create(itemData);
    await this.openingRepository.insert(item);
    return item;
  }
}
