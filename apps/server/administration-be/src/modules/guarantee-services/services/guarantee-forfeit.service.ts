import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GuaranteeForfeit } from 'src/entities/guarantee-forfeit.entity';
import { ExtraCrudService } from 'src/shared/service';
import { Repository } from 'typeorm';

@Injectable()
export class GuaranteeForfeitService extends ExtraCrudService<GuaranteeForfeit> {
  constructor(
    @InjectRepository(GuaranteeForfeit)
    private readonly forfeitRepository: Repository<GuaranteeForfeit>,
  ) {
    super(forfeitRepository);
  }
}
