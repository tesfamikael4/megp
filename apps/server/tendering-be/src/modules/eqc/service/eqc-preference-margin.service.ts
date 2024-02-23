import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EqcPreferenceMargin } from 'src/entities';
import { ExtraCrudService } from 'src/shared/service';
import { Repository } from 'typeorm';

@Injectable()
export class EqcPreferenceMarginService extends ExtraCrudService<EqcPreferenceMargin> {
  constructor(
    @InjectRepository(EqcPreferenceMargin)
    private readonly eqcPreferenceMarginRepository: Repository<EqcPreferenceMargin>,
  ) {
    super(eqcPreferenceMarginRepository);
  }
}
