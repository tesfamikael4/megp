import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EntityCrudService } from 'src/shared/service/entity-crud.service';
import { ClassificationPath } from 'src/entities/classification-path';

export class ClassificationPathService extends EntityCrudService<ClassificationPath> {
  constructor(
    @InjectRepository(ClassificationPath)
    private readonly classificationPathRepository: Repository<ClassificationPath>,
  ) {
    super(classificationPathRepository);
  }
}