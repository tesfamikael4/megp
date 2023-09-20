import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CollectionQuery, QueryConstructor } from 'src/shared/collection-query';
import { DataResponseFormat } from 'src/shared/api-data';
import { TinRegistrationDatabaseEntity } from '../entities/tin-registration-database.entity';

@Injectable()
export class TinRegistrationDatabaseService {
  constructor(
    @InjectRepository(TinRegistrationDatabaseEntity)
    private readonly tinRegistrationDatabaseEntity: Repository<TinRegistrationDatabaseEntity>,
  ) {}
  async fetch(query: CollectionQuery): Promise<any> {
    console.log(';;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;');
    try {
      const dataQuery =
        QueryConstructor.constructQuery<TinRegistrationDatabaseEntity>(
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
  async getTinRegistrationDatabaseServiceByTinNumber(
    tinNumber: string,
  ): Promise<any> {
    try {
      return await this.tinRegistrationDatabaseEntity.findOneOrFail({
        where: { tinNumber: tinNumber },
      });
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
  async getTinRegistrationDatabaseServiceById(
    id: string,
    query: CollectionQuery,
  ): Promise<any> {
    try {
      return await this.tinRegistrationDatabaseEntity.findOneOrFail({
        where: { id: id },
      });
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
