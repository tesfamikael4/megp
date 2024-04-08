import { Module } from '@nestjs/common';
import { BpServiceEntity } from '@entities';
import { BpServiceService } from './services/service.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BpServiceController } from './controllers/bp-service.controller';
import { AuthorizationModule } from '@auth';
@Module({
  imports: [TypeOrmModule.forFeature([BpServiceEntity]), AuthorizationModule],
  exports: [BpServiceService],
  providers: [BpServiceService],
  controllers: [BpServiceController],
})
export class ServiceModule { }
