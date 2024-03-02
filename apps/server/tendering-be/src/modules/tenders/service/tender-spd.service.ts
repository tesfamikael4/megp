import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TenderSpd } from 'src/entities';
import { ExtraCrudService } from 'src/shared/service';
import { Repository } from 'typeorm';

@Injectable()
export class TenderSpdService extends ExtraCrudService<TenderSpd> {
  constructor(
    @InjectRepository(TenderSpd)
    private readonly tenderSpdRepository: Repository<TenderSpd>,
  ) {
    super(tenderSpdRepository);
  }

  async findOne(tenderId: string, req?: any): Promise<TenderSpd | undefined> {
    return await this.tenderSpdRepository.findOneBy({ tenderId });
  }
}
