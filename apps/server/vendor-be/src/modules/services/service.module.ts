import { Module } from '@nestjs/common';
import { BpServiceEntity } from '../../entities/bp-service.entity';
import { BpServiceService } from './services/service.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BpServiceController } from './controllers/bp-service.controller';
@Module({
  imports: [TypeOrmModule.forFeature([BpServiceEntity])],
  exports: [BpServiceService],
  providers: [BpServiceService],
  controllers: [BpServiceController],
})
export class ServiceModule {}
