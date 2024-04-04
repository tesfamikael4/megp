import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ExtraCrudService } from 'src/shared/service';
import { Opening } from 'src/entities/opening.entity';

@Injectable()
export class OpeningService extends ExtraCrudService<Opening> {
  constructor(
    @InjectRepository(Opening)
    private readonly openingRepository: Repository<Opening>,
  ) {
    super(openingRepository);
  }
}
