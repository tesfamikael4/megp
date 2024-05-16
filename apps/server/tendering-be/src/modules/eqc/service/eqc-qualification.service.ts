import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { ENTITY_MANAGER_KEY } from 'src/shared/interceptors';
import { EqcQualification } from 'src/entities';
import { ExtraCrudService } from 'src/shared/service';
import { EntityManager, Repository } from 'typeorm';
import { ChangeQualificationCategoryDto } from '../dto';

@Injectable()
export class EqcQualificationService extends ExtraCrudService<EqcQualification> {
  constructor(
    @InjectRepository(EqcQualification)
    private readonly eqcQualificationRepository: Repository<EqcQualification>,
    @Inject(REQUEST) private request: Request,
  ) {
    super(eqcQualificationRepository);
  }

  async changeCategory(input: ChangeQualificationCategoryDto) {
    const qualifications = await this.eqcQualificationRepository.findBy({
      lotId: input.lotId,
      category: input.oldCategory,
    });

    if (!qualifications || !qualifications.length) {
      throw new BadRequestException('Qualifications not found');
    }

    const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];
    const entity = await manager
      .getRepository(EqcQualification)
      .update(
        { lotId: input.lotId, category: input.oldCategory },
        { category: input.newCategory },
      );

    return entity.affected;
  }
}
