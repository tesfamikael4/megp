import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BidSecurity } from 'src/entities';
import { BidSecurityController } from './controller';
import { BidSecurityService } from './service';

@Module({
  imports: [TypeOrmModule.forFeature([BidSecurity])],
  controllers: [BidSecurityController],
  providers: [BidSecurityService],
})
export class BidModule {}
