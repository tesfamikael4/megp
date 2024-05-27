import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tax } from 'src/entities';
import { EntityCrudService } from 'src/shared/service';
import { Repository } from 'typeorm';
import { CreateTaxDto } from '../dto/tax.dto';

@Injectable()
export class TaxService extends EntityCrudService<Tax> {
  constructor(
    @InjectRepository(Tax)
    private readonly taskRepository: Repository<Tax>,
  ) {
    super(taskRepository);
  }

  async createUniqueTax(data: CreateTaxDto) {
    const item = this.taskRepository.create({
      ...data,
      name: data.name.trim(),
    });
    await this.taskRepository.insert(item);
    return item;
  }
}
