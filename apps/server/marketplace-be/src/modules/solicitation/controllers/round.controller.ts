import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ExtraCrudOptions, ExtraCrudController } from 'megp-shared-be';
import { SolRoundService } from '../services/round.service';
import { SolRound } from 'src/entities';
import { CreateRoundDto, UpdateRoundDto } from '../dtos/round.dto';

const options: ExtraCrudOptions = {
  entityIdName: 'rfxId',
  createDto: CreateRoundDto,
  updateDto: UpdateRoundDto,
};

@ApiBearerAuth()
@Controller('sol-rounds')
@ApiTags('Sol Rounds')
export class SolRoundController extends ExtraCrudController<SolRound>(options) {
  constructor(private readonly solRemarkService: SolRoundService) {
    super(solRemarkService);
  }

  @Get('current-round/:rfxId')
  async getCurrentRound(@Param('rfxId') rfxId: string) {
    return this.solRemarkService.getCurrentRound(rfxId);
  }
}
