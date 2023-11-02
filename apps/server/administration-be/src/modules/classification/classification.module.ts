import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Classification } from 'src/entities/classification';
import { ClassificationService } from './services/classification.service';
import { ClassificationController } from './controllers/classification-controller';
import { ClassificationPath } from 'src/entities/classification-path';
import { ClassificationPathService } from './services/classification-path.service';
import { ClassificationPathController } from './controllers/classification-path.controller';
@Module({
  imports: [
    TypeOrmModule.forFeature([Classification, ClassificationPath]),
  ],
  providers: [ClassificationService, ClassificationPathService],
  controllers: [ClassificationController, ClassificationPathController],
})
export class ClassificationModule { }
