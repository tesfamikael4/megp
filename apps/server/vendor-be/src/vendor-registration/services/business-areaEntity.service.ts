import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BeneficialOwnership } from '../entities/beneficial-ownership.entity';
import { Repository } from 'typeorm';
import { BeneficialOwnershipResponse } from '../dto/beneficial-ownership.dto';
import { EntityCrudService } from 'src/shared/service';
import { AreasOfBusinessInterestEntity } from '../entities/areas-of-business-interest.entity';
import { BusinessAreaEntity } from '../entities/business-area';
import { BusinessAreaResponseDto } from '../dto/business-area.dto';

@Injectable()
export class BusinessAreaService extends EntityCrudService<BusinessAreaEntity> {
  constructor(
    @InjectRepository(BusinessAreaEntity)
    private readonly businessAreaRepository: Repository<BusinessAreaEntity>,
  ) {
    super(businessAreaRepository);
  }
  async getByVendorId(vendorId: string): Promise<BusinessAreaResponseDto> {
    try {
      return BusinessAreaResponseDto.fromDto(
        await this.businessAreaRepository.findOneOrFail({
          where: { vendorId: vendorId },
        }),
      );
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
