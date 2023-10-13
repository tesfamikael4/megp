import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { EntityCrudService } from 'src/shared/service/entity-crud.service';
import { SecurityQuestion } from '../entities/security-question.entity';

@Injectable()
export class SecurityQuestionService extends EntityCrudService<SecurityQuestion> {
  constructor(
    @InjectRepository(SecurityQuestion)
    private readonly repositorySecurityQuestion: Repository<SecurityQuestion>,
  ) {
    super(repositorySecurityQuestion);
  }
}
