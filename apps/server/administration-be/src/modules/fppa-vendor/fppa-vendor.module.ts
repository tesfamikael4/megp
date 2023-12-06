import { Logger, Module } from '@nestjs/common';
import { FppaVendorService } from './services/fppa-vendor.service';
import { FppaVendorsController } from './controllers/fppa-vendor.controller';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { FppaVendor } from '@entities';

@Module({
  imports: [TypeOrmModule.forFeature([FppaVendor])],
  controllers: [FppaVendorsController],
  providers: [FppaVendorService, Logger],
  exports: [FppaVendorService],
})
export class FppaVendorModule {}
