import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Classification } from 'src/entities/classification';
import { EntityCrudService } from 'src/shared/service';
export class ClassificationService extends EntityCrudService<Classification> {
  constructor(
    @InjectRepository(Classification)
    private readonly classificationRepository: Repository<Classification>,
  ) {
    super(classificationRepository);
  }
  async findByType() {
    const type = 'commodity';
    return this.classificationRepository.find({ where: { type: type } });
  }
}
