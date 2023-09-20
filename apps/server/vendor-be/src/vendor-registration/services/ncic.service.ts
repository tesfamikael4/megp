import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { NCICEntity } from '../entities/ncic.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CollectionQuery, QueryConstructor } from 'src/shared/collection-query';
import { DataResponseFormat } from 'src/shared/api-data';

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
  async getNCICDataTinNumber(tinNumber: string): Promise<any> {
    try {
      return await this.tinRegistrationDatabaseEntity.findOneOrFail({
        where: { tinNumber: tinNumber },
      });
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
  async getNCICDataById(id: string, query: CollectionQuery): Promise<any> {
    try {
      return await this.tinRegistrationDatabaseEntity.findOneOrFail({
        where: { id: id },
      });
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
