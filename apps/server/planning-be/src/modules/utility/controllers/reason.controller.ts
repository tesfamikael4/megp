import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EntityCrudOptions } from 'src/shared/types/crud-option.type';
import { EntityCrudController } from 'src/shared/controller';
import { Reason } from 'src/entities/reason.entity';
import { ReasonService } from '../services/reason.service';
import { CurrentUser } from 'src/shared/authorization';

const options: EntityCrudOptions = {};

@Controller('reasons')
@ApiTags('reasons')
export class ReasonController extends EntityCrudController<Reason>(options) {
  constructor(private readonly reasonService: ReasonService) {
    super(reasonService);
  }
}
