import { Module } from '@nestjs/common';
import { BpServiceEntity } from '../../entities/bp-service.entity';
import { BpServiceService } from './services/service.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BpServiceController } from './controllers/bp-service.controller';
import { AuthorizationModule } from 'src/shared/authorization';
@Module({
  imports: [TypeOrmModule.forFeature([BpServiceEntity]), AuthorizationModule],
  exports: [BpServiceService],
  providers: [BpServiceService],
  controllers: [BpServiceController],
})
export class ServiceModule {}
