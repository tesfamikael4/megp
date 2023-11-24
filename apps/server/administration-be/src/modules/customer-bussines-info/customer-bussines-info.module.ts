import { Logger, Module } from '@nestjs/common';
import { CustomerBussinesInfoService } from './services/customer-bussines-info.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerBussinesInfo } from '@entities';
import { CustomerBussinesInfosController } from './controllers/customer-bussines-infos.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerBussinesInfo])],
  controllers: [CustomerBussinesInfosController],
  providers: [CustomerBussinesInfoService, Logger],
  exports: [CustomerBussinesInfoService],
})
export class CustomerBussinesInfoModule {}
