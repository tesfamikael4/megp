import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BiddersComparisonService } from './services/bidders-comparison.service';
import { BiddersComparison } from 'src/entities/bidders-comparison.entity';
import { BiddersComparisonController } from './controller/bidders-comparison.controller';

@Module({
  imports: [TypeOrmModule.forFeature([BiddersComparison])],
  providers: [BiddersComparisonService],
  controllers: [BiddersComparisonController],
})
export class BiddersComparisonModule {}
