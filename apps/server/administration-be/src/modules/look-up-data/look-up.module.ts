import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemCategoryService } from './service/item-category.service';
import { ItemCategoriesController } from './controller/item-category.controller';
import { MeasurementController } from './controller/measurement.controller';
import { TagController } from './controller/tag.controller';
import { MeasurementService } from './service/measurement.service';
import { TagService } from './service/tag.service';
import { ItemCategory } from 'src/entities/item-category.entity';
import { Measurement } from 'src/entities/measurement.entity';
import { Tag } from 'src/entities/tag.entity';
import { UnitOfMeasurement } from 'src/entities/uom.entity';
import { UnitOfMeasurementController } from './controller/unit-of-measurent.controller';
import { UnitOfMeasurementService } from './service/unit-of-measurement.service';
import { Currency } from 'src/entities/currency.entity';
import { CurrencyService } from './service/currency.service';
import { CurrencyController } from './controller/currency.controller';
import { TargetGroup } from 'src/entities/target-group.entity';
import { Region } from 'src/entities/region.entity';
import { District } from 'src/entities/district.entity';
import { TargetGroupService } from './service/target-group.service';
import { RegionService } from './service/region.service';
import { DistrictService } from './service/district.service';
import { DistrictController } from './controller/district.controller';
import { TargetGroupController } from './controller/target-group.controller';
import { RegionController } from './controller/region.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ItemCategory,
      Currency,
      TargetGroup,
      Region,
      District,
      Measurement,
      UnitOfMeasurement,
      Tag,
    ]),
  ],
  providers: [
    ItemCategoryService,
    CurrencyService,
    TargetGroupService,
    RegionService,
    DistrictService,
    MeasurementService,
    UnitOfMeasurementService,
    TagService,
  ],
  controllers: [
    ItemCategoriesController,
    CurrencyController,
    TargetGroupController,
    RegionController,
    DistrictController,
    MeasurementController,
    UnitOfMeasurementController,
    TagController,
  ],
})
export class lookUpDataModule { }
