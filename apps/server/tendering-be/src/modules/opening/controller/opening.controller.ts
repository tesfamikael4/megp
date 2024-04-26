import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ExtraCrudController } from 'src/shared/controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { Opening } from 'src/entities';
import { OpeningService } from '../service/opening.service';
import { CreateOpeningDto } from '../dto/opening.dto';

const options: ExtraCrudOptions = {
  entityIdName: 'tenderId',
  createDto: CreateOpeningDto,
};

@Controller('opening')
@ApiTags('Opening Controller')
export class OpeningController extends ExtraCrudController<Opening>(options) {
  constructor(private readonly openingService: OpeningService) {
    super(openingService);
  }

  @Get('complete/:tenderId')
  async complete(@Param('tenderId') tenderId: string) {
    return this.openingService.complete({ tenderId });
  }
}
