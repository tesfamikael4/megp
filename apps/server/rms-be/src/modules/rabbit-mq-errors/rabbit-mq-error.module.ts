import { Module } from '@nestjs/common';
import { RabbitMqErrorService } from './services/rabbit-mq-error.service';
import { RabbitMqErrorController } from './controllers/rabbit-mq-error.controller';
import { LogController } from './controllers/log.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RabbitMqError } from 'src/entities';

@Module({
  imports: [TypeOrmModule.forFeature([RabbitMqError])],
  controllers: [RabbitMqErrorController, LogController],
  providers: [RabbitMqErrorService],
})
export class RabbitMqErrorModule {}
