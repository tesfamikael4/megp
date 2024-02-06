import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Rule } from 'src/entities';
import { ExtraCrudService } from 'src/shared/service';
import { Repository } from 'typeorm';

@Injectable()
export class RuleService extends ExtraCrudService<Rule> {
  constructor(
    @InjectRepository(Rule) private readonly repositoryRule: Repository<Rule>,
  ) {
    super(repositoryRule);
  }
}
