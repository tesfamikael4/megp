import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EntityCrudOptions } from 'src/shared/types/crud-option.type';
import { EntityCrudController } from 'src/shared/controller';
import { CreateDonorDto, UpdateDonorDto } from '../dto/donor.dto';
import { Donor } from 'src/entities/donor.entity';
import { DonorService } from '../service/donor.service';

const options: EntityCrudOptions = {
  createDto: CreateDonorDto,
  updateDto: UpdateDonorDto,
};

@Controller('donors')
@ApiTags('Donors')
export class DonorController extends EntityCrudController<Donor>(options) {
  constructor(private readonly donorService: DonorService) {
    super(donorService);
  }

  @Post()
  async createUniqueDonor(@Body() dto: CreateDonorDto): Promise<Donor> {
    return this.donorService.createUniqueDonor(dto);
  }
}
