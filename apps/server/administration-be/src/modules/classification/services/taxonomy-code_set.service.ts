import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaxonomyCodeSet } from 'src/entities/taxonomy-code-set.entity';
import { EntityCrudService } from 'src/shared/service';
import { Repository } from 'typeorm';
import { ClassificationService } from './classification.service';
import { CreateTaxonomyCodeSetDto } from '../dtos/create-taxonomy.dto';

@Injectable()
export class TaxonomyCodeSetService extends EntityCrudService<TaxonomyCodeSet> {
  constructor(
    @InjectRepository(TaxonomyCodeSet)
    private readonly taxonomyCodeSetRepository: Repository<TaxonomyCodeSet>,
    private readonly classificationService: ClassificationService,
  ) {
    super(taxonomyCodeSetRepository);
  }
  async create(
    taxonomyCodeSetDto: CreateTaxonomyCodeSetDto,
  ): Promise<TaxonomyCodeSet> {
    const taxonomy = await this.taxonomyCodeSetRepository.save({
      name: taxonomyCodeSetDto.name,
      version: taxonomyCodeSetDto.version,
    });
    if (taxonomy) {
      await this.classificationService.upsert(
        taxonomyCodeSetDto.excelData.segments,
        taxonomy.id,
      );
      await this.classificationService.upsert(
        taxonomyCodeSetDto.excelData.families,
        taxonomy.id,
      );
      await this.classificationService.upsert(
        taxonomyCodeSetDto.excelData.classes,
        taxonomy.id,
      );
      await this.classificationService.upsert(
        taxonomyCodeSetDto.excelData.commodities,
        taxonomy.id,
      );
    }
    return taxonomy;
  }
}
