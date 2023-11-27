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
  findLatest() {
    return this.taxonomyCodeSetRepository.findOne({
      order: { createdAt: 'DESC' },
      where: {},
    });
  }
  async create(
    taxonomyCodeSetDto: CreateTaxonomyCodeSetDto,
  ): Promise<TaxonomyCodeSet> {
    const taxonomy = await this.taxonomyCodeSetRepository.save({
      name: taxonomyCodeSetDto.name,
      version: taxonomyCodeSetDto.version,
    });
    const commodities = taxonomyCodeSetDto.excelData.commodities;
    const chunkSize = 4000;
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

      /**
       *error: bind message has 57251 parameter formats but 0 parameters QueryFailedError: bin
       * chunked the data to prevent the above error
       */
      for (let i = 0; i < commodities.length; i += chunkSize) {
        const chunk = commodities.slice(i, i + chunkSize);
        try {
          await this.classificationService.upsert(chunk, taxonomy.id);
        } catch (error) {
          console.error(`Error processing chunk ${i / chunkSize + 1}:`, error);
        }
      }
    }
    return taxonomy;
  }
}
