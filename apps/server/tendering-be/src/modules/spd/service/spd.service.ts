import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { EntityCrudService } from 'src/shared/service';
import { Spd } from 'src/entities/spd.entity';
import { ToggleIsActiveDto } from '../dto';

@Injectable()
export class SpdService extends EntityCrudService<Spd> {
  constructor(
    @InjectRepository(Spd)
    private readonly spdRepository: Repository<Spd>,
  ) {
    super(spdRepository);
  }

  async toggleActiveStatus(payload: ToggleIsActiveDto) {
    const spd = await this.spdRepository.findOneBy({ id: payload.id });
    if (!spd) {
      throw new BadRequestException('spd_not_found');
    }

    await this.spdRepository.update(spd.id, {
      isActive: !spd.isActive,
    });

    spd.isActive = !spd.isActive;

    return spd;
  }
}
