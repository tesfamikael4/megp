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

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ItemCategory,
      Measurement,
      UnitOfMeasurement,
      Tag,
    ]),
  ],
  providers: [
    ItemCategoryService,
    MeasurementService,
    UnitOfMeasurementService,
    TagService,
  ],
  controllers: [
    ItemCategoriesController,
    MeasurementController,
    UnitOfMeasurementController,
    TagController,
  ],
})
export class lookUpDataModule { }
