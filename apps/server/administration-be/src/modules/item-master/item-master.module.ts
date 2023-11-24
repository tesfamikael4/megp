import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemMasterService } from './services/item-master.service';
import { ItemMasterConroller } from './controllers/item-master-controller';
import { ExtraItemTagController } from './controllers/extra-item-tag.controller';
import { ExtraItemTagService } from './services/extra-services/extra-tem-tag.service';
import { ItemCodeSequence } from 'src/entities/item-code-sequence.entity';
import { ItemTag } from 'src/entities/item-tag.entity';
import { Classification } from 'src/entities/classification.entity';
import { ItemCategory } from 'src/entities/item-category.entity';
import { Measurement } from 'src/entities/measurement.entity';
import { Tag } from 'src/entities/tag.entity';
import { ItemCodeGeneratorService } from './services/item-code-generator.service';
import { ItemMaster } from 'src/entities/item-master.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      ItemMaster,
      ItemCodeSequence,
      ItemTag,
      Classification,
      ItemCategory,
      Measurement,
      Tag,
    ]),
  ],
  providers: [ItemMasterService, ItemCodeGeneratorService, ExtraItemTagService],
  controllers: [ItemMasterConroller, ExtraItemTagController],
})
export class ItemMasterModule {}
