import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AreasOfBusinessInterestResponse } from '../dto/areas-of-business-interest';
import { EntityCrudService } from 'src/shared/service';
import { AreasOfBusinessInterestEntity } from 'src/entities';

@Injectable()
export class AreasOfBusinessInterestService extends EntityCrudService<AreasOfBusinessInterestEntity> {
  constructor(
    @InjectRepository(AreasOfBusinessInterestEntity)
    private readonly areasOfBusinessInteresteRepository: Repository<AreasOfBusinessInterestEntity>,
  ) {
    super(areasOfBusinessInteresteRepository);
  }
  async fetch(): Promise<any> {
    try {
      const result = await this.areasOfBusinessInteresteRepository.find();
      if (!result) {
        throw new NotFoundException(
          `getting AreasOfBusinessIntereste failed  `,
        );
      }
      return result?.map((element) =>
        AreasOfBusinessInterestResponse.fromEntity(element),
      );
    } catch (error) {
      console.log(error);
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
  async getAreasOfBusinessInteresteByVendorId(vendorId: string): Promise<any> {
    try {
      const result = await this.areasOfBusinessInteresteRepository.findOne({
        where: { vendorId: vendorId },
      });
      if (!result) {
        throw new NotFoundException(
          `Vendor AreasOfBusiness Intereste for  ${vendorId} is not found`,
        );
      }
      return AreasOfBusinessInterestResponse.fromEntity(result);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
