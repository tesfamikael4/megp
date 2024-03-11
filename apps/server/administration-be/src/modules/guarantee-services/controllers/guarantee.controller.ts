import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DataResponseFormat } from 'src/shared/api-data';
import { EntityCrudOptions } from 'src/shared/types/crud-option.type';
import { EntityCrudController } from 'src/shared/controller';
import { Guarantee } from 'src/entities/guarantee.entity';
import { GuaranteeService } from '../services/guarantee.service';
import { CreateGuaranteeDto, UpdateGuaranteeDto } from '../dtos/guarantee.dto';
import { JwtGuard } from 'src/shared/authorization/guards/jwt.guard';
import { CurrentUser } from 'src/shared/authorization';
const options: EntityCrudOptions = {
  createDto: CreateGuaranteeDto,
  updateDto: UpdateGuaranteeDto,
};
@Controller('guarantees')
@ApiTags(' guarantees')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiExtraModels(DataResponseFormat)
export class GuaranteeController extends EntityCrudController<Guarantee>(
  options,
) {
  constructor(private readonly guaranteeService: GuaranteeService) {
    super(guaranteeService);
  }
}
