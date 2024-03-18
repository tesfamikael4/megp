import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SccGuarantee } from 'src/entities';
import { ExtraCrudController } from 'src/shared/controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { SccGuaranteeService } from '../service';

const options: ExtraCrudOptions = {
  entityIdName: 'tenderId',
};

@ApiBearerAuth()
@Controller('scc-guarantees')
@ApiTags('Scc Guarantee Controller')
export class SccGuaranteeController extends ExtraCrudController<SccGuarantee>(
  options,
) {
  constructor(private readonly sccGuaranteeService: SccGuaranteeService) {
    super(sccGuaranteeService);
  }
}
