import { Injectable } from '@nestjs/common';
import { RabbitMqError } from 'src/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RabbitMqErrorService {
  constructor(
    @InjectRepository(RabbitMqError)
    private readonly rabbitMqErrorRepository: Repository<RabbitMqError>,
  ) {}

  async log(payload: any) {
    const item = this.rabbitMqErrorRepository.create(payload);
    await this.rabbitMqErrorRepository.insert(item);
  }
}
