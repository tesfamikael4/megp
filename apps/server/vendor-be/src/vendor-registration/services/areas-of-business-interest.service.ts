import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AreasOfBusinessInterestEntity } from '../entities/areas-of-business-interest.entity';
import { AreasOfBusinessInterestResponse } from '../dto/areas-of-business-interest';

@Injectable()
export class AreasOfBusinessInterestService {
  constructor(
    @InjectRepository(AreasOfBusinessInterestEntity)
    private readonly areasOfBusinessInteresteRepository: Repository<AreasOfBusinessInterestEntity>,
  ) {}
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
