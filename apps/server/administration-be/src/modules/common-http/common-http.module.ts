import { Module } from '@nestjs/common';
import { CommonHttpService } from './common-http.service';

@Module({
  imports: [],
  providers: [CommonHttpService],
  exports: [CommonHttpService],
})
export class CommonHttpModule {}
