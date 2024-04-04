import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ExtraCrudService } from 'src/shared/service';
import { SharedBidderKey } from 'src/entities';

@Injectable()
export class SharedBidderKeyService extends ExtraCrudService<SharedBidderKey> {
  constructor(
    @InjectRepository(SharedBidderKey)
    private readonly sharedBidderKeyRepository: Repository<SharedBidderKey>,
  ) {
    super(sharedBidderKeyRepository);
  }
}
