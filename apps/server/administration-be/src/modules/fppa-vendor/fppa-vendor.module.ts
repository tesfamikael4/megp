import { Logger, Module } from '@nestjs/common';
import { FppaVendorService } from './services/fppa-vendor.service';
import { FppaVendorsController } from './controllers/fppa-vendor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FppaVendor } from '@entities';
import { BusinessArea } from 'src/entities/fppa-business-area.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FppaVendor, BusinessArea])],
  controllers: [FppaVendorsController],
  providers: [FppaVendorService, Logger],
  exports: [FppaVendorService],
})
export class FppaVendorModule {}
