import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EntityCrudService } from 'src/shared/service/entity-crud.service';
import { ClassificationPath } from 'src/entities/classification-path';
import { ExtraCrudService } from 'src/shared/service/extra-crud.service';

export class ClassificationPathService extends ExtraCrudService<ClassificationPath> {
  constructor(
    @InjectRepository(ClassificationPath)
    private readonly classificationPathRepository: Repository<ClassificationPath>,
  ) {
    super(classificationPathRepository);
  }
}
