import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BidSecurity } from 'src/entities';
import { ExtraCrudService } from 'src/shared/service';
import { Repository } from 'typeorm';

@Injectable()
export class BidSecurityService extends ExtraCrudService<BidSecurity> {
  constructor(
    @InjectRepository(BidSecurity)
    private readonly bidSecurityRepository: Repository<BidSecurity>,
  ) {
    super(bidSecurityRepository);
  }

  async findOne(lotId: string, req?: any): Promise<BidSecurity | undefined> {
    return await this.bidSecurityRepository.findOneBy({ lotId });
  }
}
