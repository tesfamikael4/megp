import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Donor } from 'src/entities/donor.entity';
import { EntityCrudService } from 'src/shared/service';
import { Repository } from 'typeorm';
import { CreateDonorDto } from '../dto/donor.dto';

@Injectable()
export class DonorService extends EntityCrudService<Donor> {
  constructor(
    @InjectRepository(Donor)
    private readonly donorRepository: Repository<Donor>,
  ) {
    super(donorRepository);
  }

  async createUniqueDonor(donorDto: CreateDonorDto): Promise<Donor> {
    const donorExists = await this.donorRepository.exists({
      where: {
        name: donorDto.name,
      },
    });
    if (donorExists) {
      throw new ConflictException({
        name: donorDto.name,
        message: 'Donor already exists',
      });
    } else {
      const newICat = await super.create(donorDto);
      return newICat;
    }
  }
}
