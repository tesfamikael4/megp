import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ExtraCrudService } from 'src/shared/service';
import { BidSecurity } from 'src/entities/bid-security.entity';

@Injectable()
export class BidSecurityService extends ExtraCrudService<BidSecurity> {
  constructor(
    @InjectRepository(BidSecurity)
    private readonly bidSecurityRepository: Repository<BidSecurity>,
  ) {
    super(bidSecurityRepository);
  }
}
