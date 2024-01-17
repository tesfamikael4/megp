import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Rule } from 'src/entities';
import { EntityCrudService } from 'src/shared/service';
import { Repository } from 'typeorm';

@Injectable()
export class RuleService extends EntityCrudService<Rule> {
  constructor(
    @InjectRepository(Rule) private readonly repositoryRule: Repository<Rule>,
  ) {
    super(repositoryRule);
  }
}
