import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemMaster } from './entities/item-master.entity';
import { ItemMasterService } from './services/item-master.service';
import { ItemMasterConroller } from './controllers/item-master-controller';
import { ItemCodeSequence } from './entities/item-code-sequence';
import { ItemCodeGeneratorService } from './services/item-code-generator.service';
import { Classification } from './entities/classification.entity';
import { ItemCategory } from './entities/item-category.entity';
import { Measurement } from './entities/measurement.entity';
import { UOM } from './entities/uom.entity';
import { Tag } from './entities/tag.entity';
import { ExtraItemTagController } from './controllers/extra-item-tag.controller';
import { ExtraItemTagService } from './services/extra-services/extra-tem-tag.service';
import { ItemTag } from './entities/item-tag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([
    ItemMaster,
    ItemCodeSequence,
    ItemTag,
    Classification,
    ItemCategory,
    Measurement,
    UOM,
    Tag])],
  providers: [
    ItemMasterService,
    ItemCodeGeneratorService,
    ExtraItemTagService
  ],
  controllers: [ItemMasterConroller, ExtraItemTagController],
})
export class ItemMasterModule { }
