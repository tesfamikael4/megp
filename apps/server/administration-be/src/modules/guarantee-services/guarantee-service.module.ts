import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GuaranteeExtension } from 'src/entities/guarantee-extension.entity';
import { GuaranteeForfeit } from 'src/entities/guarantee-forfeit.entity';
import { GuaranteeRelease } from 'src/entities/guarantee-release.entity';
import { Guarantee } from 'src/entities/guarantee.entity';
import { GuaranteeService } from './services/guarantee.service';
import { GuaranteeExtensionService } from './services/guarantee-extension.service';
import { GuaranteeForfeitService } from './services/guarantee-forfeit.service';
import { GuaranteeReleaseService } from './services/guarantee-release.service';
import { GuaranteeController } from './controllers/guarantee.controller';
import { GuaranteeExtensionController } from './controllers/guarantee-extension.controller';
import { GuaranteeForfeitController } from './controllers/guarantee-forfeit.controller';
import { GuaranteeReleaseController } from './controllers/guarantee-release.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Guarantee,
      GuaranteeExtension,
      GuaranteeForfeit,
      GuaranteeRelease,
    ]),
  ],
  providers: [
    GuaranteeService,
    GuaranteeExtensionService,
    GuaranteeForfeitService,
    GuaranteeReleaseService,
  ],
  controllers: [
    GuaranteeController,
    GuaranteeExtensionController,
    GuaranteeForfeitController,
    GuaranteeReleaseController,
  ],
})
export class GuaranteeServiceModule {}
