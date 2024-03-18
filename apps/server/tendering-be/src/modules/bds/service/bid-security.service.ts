import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BdsBidSecurity } from 'src/entities';
import { ExtraCrudService } from 'src/shared/service';
import { Repository } from 'typeorm';

@Injectable()
export class BdsBidSecurityService extends ExtraCrudService<BdsBidSecurity> {
  constructor(
    @InjectRepository(BdsBidSecurity)
    private readonly bidSecurityRepository: Repository<BdsBidSecurity>,
  ) {
    super(bidSecurityRepository);
  }

  async findOne(lotId: string, req?: any): Promise<BdsBidSecurity | undefined> {
    return await this.bidSecurityRepository.findOneBy({ lotId });
  }
}
