import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassificationService } from './services/classification.service';
import { ClassificationController } from './controllers/classification-controller';
import { TaxonomyCodeSetController } from './controllers/taxonomy-codeset-controller';
import { TaxonomyCodeSetService } from './services/taxonomy-code_set.service';
import { TaxonomyCodeSet } from 'src/entities/taxonomy-code-set.entity';
import { Classification } from 'src/entities/classification.entity';
@Module({
  imports: [TypeOrmModule.forFeature([TaxonomyCodeSet, Classification])],
  providers: [ClassificationService, TaxonomyCodeSetService],
  controllers: [ClassificationController, TaxonomyCodeSetController],
  exports: [ClassificationService],
})
export class ClassificationModule {}
