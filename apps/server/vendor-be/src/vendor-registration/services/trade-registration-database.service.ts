import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CollectionQuery, QueryConstructor } from 'src/shared/collection-query';
import { DataResponseFormat } from 'src/shared/api-data';
import { TradeRegistrationDatabaseEntity } from '../entities/trade-registration-database.entity';

@Injectable()
export class TradeRegistrationDatabaseService {
  constructor(
    @InjectRepository(TradeRegistrationDatabaseEntity)
    private readonly tradeRegistrationDatabaseEntity: Repository<TradeRegistrationDatabaseEntity>,
  ) { }
  async fetch(query: CollectionQuery): Promise<any> {
    try {
      const dataQuery =
        QueryConstructor.constructQuery<TradeRegistrationDatabaseEntity>(
          this.tradeRegistrationDatabaseEntity,
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
  async getTradeRegistrationDatabaseServiceByTinNumber(
    tinNumber: string,
  ): Promise<any> {
    try {
      return await this.tradeRegistrationDatabaseEntity.findOneOrFail({
        where: { tinNumber: tinNumber },
      });
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
  async getTradeRegistrationDatabaseServiceById(
    id: string,
    query: CollectionQuery,
  ): Promise<any> {
    try {
      return await this.tradeRegistrationDatabaseEntity.findOneOrFail({
        where: { id: id },
      });
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
