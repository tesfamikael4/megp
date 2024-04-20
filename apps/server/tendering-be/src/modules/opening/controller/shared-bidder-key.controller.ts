import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ExtraCrudController } from 'src/shared/controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { SharedBidderKey } from 'src/entities';
import { SharedBidderKeyService } from '../service/shared-bidder-key.service';

const options: ExtraCrudOptions = {
  entityIdName: 'tenderId',
};

@Controller('shared-bidder-key')
@ApiTags('Shared Bidder Key Controller')
export class SharedBidderKeyController extends ExtraCrudController<SharedBidderKey>(
  options,
) {
  constructor(private readonly sharedBidderKeyService: SharedBidderKeyService) {
    super(sharedBidderKeyService);
  }
}
