import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EntityCrudService } from 'src/shared/service';
import { Guarantee } from 'src/entities/guarantee.entity';
@Injectable()
export class GuaranteeService extends EntityCrudService<Guarantee> {
  constructor(
    @InjectRepository(Guarantee)
    private readonly guarantee: Repository<Guarantee>,
  ) {
    super(guarantee);
  }
}
