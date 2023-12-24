import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ExtraCrudService } from 'src/shared/service';
import { PostProcurementMechanism } from 'src/entities/post-procurement-mechanism.entity';

@Injectable()
export class PostProcurementMechanismService extends ExtraCrudService<PostProcurementMechanism> {
  constructor(
    @InjectRepository(PostProcurementMechanism)
    private readonly repositoryPostProcurementMechanism: Repository<PostProcurementMechanism>,
  ) {
    super(repositoryPostProcurementMechanism);
  }
}
