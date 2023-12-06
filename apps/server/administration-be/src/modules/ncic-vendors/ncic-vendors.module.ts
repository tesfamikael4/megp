import { Logger, Module } from '@nestjs/common';
import { NcicVendorsService } from './services/ncic-vendors.service';
import { NcicVendorsController } from './controllers/ncic-vendors.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NcicVendor } from '../../entities/ncic-vendor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NcicVendor])],
  controllers: [NcicVendorsController],
  providers: [NcicVendorsService, Logger],
  exports: [NcicVendorsService],
})
export class NcicVendorsModule {}
