import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { ExtraCrudController } from 'src/shared/controller';
import {
  CreateIPDCMemberDto,
  UpdateIPDCMemberDto,
} from '../dto/ipdc-members.dto';
import { IPDCMemberService } from '../services/ipdc-member.service';
import { IPDCMember } from 'src/entities';

const options: ExtraCrudOptions = {
  entityIdName: 'procurementInstitutionId',
  createDto: CreateIPDCMemberDto,
  updateDto: UpdateIPDCMemberDto,
};

@Controller('ipdc-Member')
@ApiTags('ipdc-Member')
export class IPDCMemberController extends ExtraCrudController<IPDCMember>(
  options,
) {
  constructor(private readonly IPDCMemberService: IPDCMemberService) {
    super(IPDCMemberService);
  }
}
