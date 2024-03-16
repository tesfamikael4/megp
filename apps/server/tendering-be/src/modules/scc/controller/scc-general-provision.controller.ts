import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SccGeneralProvision } from 'src/entities';
import { ExtraCrudController } from 'src/shared/controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { SccGeneralProvisionService } from '../service';

const options: ExtraCrudOptions = {
  entityIdName: 'tenderId',
};

@ApiBearerAuth()
@Controller('scc-general-provisions')
@ApiTags('Scc General Provision Controller')
export class SccGeneralProvisionController extends ExtraCrudController<SccGeneralProvision>(
  options,
) {
  constructor(
    private readonly sccGeneralProvisionService: SccGeneralProvisionService,
  ) {
    super(sccGeneralProvisionService);
  }
}
