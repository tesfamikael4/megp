import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TinRegistrationDatabaseEntity } from '../entities/tin-registration-database.entity';
import { VendorInitiationBody } from '../dto/vendor.dto';
import { NCICEntity } from '../entities/ncic.entity';
import { TradeRegistrationDatabaseEntity } from '../entities/trade-registration-database.entity';

@Injectable()
export class TinRegistrationDatabaseService {
  constructor(
    @InjectRepository(TinRegistrationDatabaseEntity)
    private readonly tinRegistrationDatabaseRepository: Repository<TinRegistrationDatabaseEntity>,
    @InjectRepository(NCICEntity)
    private readonly NCICtinRegistrationDatabaseRepository: Repository<NCICEntity>,
    @InjectRepository(TradeRegistrationDatabaseEntity)
    private readonly tradeRegistrationDatabaseRepository: Repository<TradeRegistrationDatabaseEntity>,
  ) {}

  async getTinRegistrationDatabaseServiceByTinNumber(
    vendorInitiationData: any,
  ): Promise<any> {
    try {
      const tinRegistrationData =
        await this.tinRegistrationDatabaseRepository.findOne({
          where: { tinNumber: vendorInitiationData.TinNumber },
        });
      const tradeRegistrationData =
        await this.tradeRegistrationDatabaseRepository.findOne({
          where: { tinNumber: vendorInitiationData.TinNumber },
        });
      const ncicRegistrationData =
        await this.NCICtinRegistrationDatabaseRepository.findOne({
          where: { tinNumber: vendorInitiationData.TinNumber },
        });
      return {
        data: vendorInitiationData,
        tinRegistrationData: tinRegistrationData,
        tradeRegistrationData: tradeRegistrationData,
        ncicRegistrationData: ncicRegistrationData,
      };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
