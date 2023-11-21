import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClassificationPath } from 'src/entities/classification-path';
import { ExtraCrudService } from 'src/shared/service';

export class ClassificationPathService extends ExtraCrudService<ClassificationPath> {
  constructor(
    @InjectRepository(ClassificationPath)
    private readonly classificationPathRepository: Repository<ClassificationPath>,
  ) {
    super(classificationPathRepository);
  }
}
