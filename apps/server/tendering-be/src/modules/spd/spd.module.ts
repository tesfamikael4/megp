import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpdService } from './service/spd.service';
import { SpdController } from './controller/spd.controller';
import { SpdSccService } from './service/spd-scc.service';
import { SpdTechnicalScoringService } from './service/spd-technical-scoring.service';
import { SpdBdsService } from './service/spd-bds.service';
import { SpdBdsController } from './controller/spd-bds.controller';
import { SpdSccController } from './controller/spd-scc.controller';
import { SpdTechnicalScoringController } from './controller/spd-technical-scoring.controller';
import {
  SpdBdsEntity,
  SpdSccEntity,
  SpdTechnicalScoringEntity,
  SpdEntity,
} from 'src/entities';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      SpdEntity,
      SpdBdsEntity,
      SpdSccEntity,
      SpdTechnicalScoringEntity,
    ]),
  ],
  providers: [
    SpdService,
    SpdSccService,
    SpdBdsService,
    SpdTechnicalScoringService,
  ],
  controllers: [
    SpdController,
    SpdBdsController,
    SpdSccController,
    SpdTechnicalScoringController,
  ],
})
export class SpdModule {}
