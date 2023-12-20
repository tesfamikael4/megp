import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Classification } from 'src/entities/classification.entity';
import { CreateClassificationDto } from '../dtos/create-classfication.dto';
import { ExtraCrudService } from 'src/shared/service';
import { CollectionQuery, QueryConstructor } from 'src/shared/collection-query';
import { DataResponseFormat } from 'src/shared/api-data';
export class ClassificationService extends ExtraCrudService<Classification> {
  constructor(
    @InjectRepository(Classification)
    private readonly classificationRepository: Repository<Classification>,
  ) {
    super(classificationRepository);
  }

  async upsert(
    createClassificationDto: CreateClassificationDto[],
    taxonomyCodeSetId: string,
  ) {
    const createdClassifications = this.classificationRepository.create(
      createClassificationDto,
    );
    createdClassifications.forEach(
      (classification) =>
        (classification.taxonomyCodeSetId = taxonomyCodeSetId),
    );
    await this.classificationRepository.upsert(createdClassifications, [
      'code',
    ]);
  }

  async findChildren(query: CollectionQuery) {
    return await this.getClassifications(query);
  }

  private async getClassifications(query: CollectionQuery) {
    const dataQuery = QueryConstructor.constructQuery<Classification>(
      this.classificationRepository,
      query,
    );

    const response = new DataResponseFormat<Classification>();
    if (query.count) {
      response.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      response.total = total;
      response.items = result;
    }

    return response;
  }
  async findClassificationHistory(code: string): Promise<any[]> {
    const classification = await this.classificationRepository.findOne({
      where: {
        code,
      },
    });

    if (!classification) {
      return [];
    }

    return this.buildHierarchy(classification, []);
  }

  private async buildHierarchy(
    classification: any,
    hierarchy: any[],
  ): Promise<any[]> {
    if (classification.parentCode) {
      const parent = await this.classificationRepository.findOne({
        where: {
          code: classification.parentCode,
        },
      });

      await this.buildHierarchy(parent, hierarchy);
    }

    hierarchy.push(classification);
    return hierarchy;
  }
}
