import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
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

  async findChildren(query: CollectionQuery, code?: string) {
    if (code) {
      query.where.push([
        {
          column: 'parentCode',
          value: code,
          operator: '=',
        },
      ]);
    } else {
      query.where.push([
        {
          column: 'parentCode',
          value: code,
          operator: 'IsNull',
        },
      ]);
    }

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
}
