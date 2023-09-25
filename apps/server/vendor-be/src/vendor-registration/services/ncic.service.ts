import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { NCICEntity } from '../entities/ncic.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CollectionQuery, QueryConstructor } from 'src/shared/collection-query';
import { DataResponseFormat } from 'src/shared/api-data';
import { VendorInitiationBody } from '../dto/vendor.dto';

@Injectable()
export class NCICService {
  constructor(
    @InjectRepository(NCICEntity)
    private readonly tinRegistrationDatabaseEntity: Repository<NCICEntity>,
  ) {}
  async fetch(query: CollectionQuery): Promise<any> {
    console.log(';;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;');
    try {
      const dataQuery = QueryConstructor.constructQuery<NCICEntity>(
        this.tinRegistrationDatabaseEntity,
        query,
      );
      const response = new DataResponseFormat<any>();
      if (query.count) {
        response.total = await dataQuery.getCount();
      } else {
        const [result, total] = await dataQuery.getManyAndCount();
        response.total = total;
        response.items = result;
      }
      return response;
    } catch (error) {
      console.log(error);
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
  async getNCICDataTinNumber(
    VendorInitiationData: VendorInitiationBody,
  ): Promise<any> {
    try {
      const result = await this.tinRegistrationDatabaseEntity.findOneOrFail({
        where: { tinNumber: VendorInitiationData.TinNumber },
      });
      if (!result) {
        throw new NotFoundException(
          `Vendor with Tin Number ${VendorInitiationData.TinNumber} is not found in NCIC database`,
        );
      }

      return { data: VendorInitiationData, externalSource: result };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async getNCICDataById(id: string): Promise<any> {
    try {
      return await this.tinRegistrationDatabaseEntity.findOneOrFail({
        where: { id: id },
      });
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
