import { Injectable, Logger } from '@nestjs/common';
import { CreateCustomerBussinesInfoDto } from '../dto/create-customer-bussines-info.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerBussinesInfo } from '@entities';
import { DeleteResult, Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { EntityCrudService } from '@generic-services';
import { TraderDataValidation } from '../dto/trader-data-validation';
@Injectable()
export class CustomerBussinesInfoService extends EntityCrudService<CustomerBussinesInfo> {
  constructor(
    @InjectRepository(CustomerBussinesInfo)
    private readonly customerBussinesInfoRepo: Repository<CustomerBussinesInfo>,
    private readonly logger: Logger,
  ) {
    super(customerBussinesInfoRepo);
  }

  async createBulkyData(
    traderDataValidation: TraderDataValidation,
  ): Promise<CustomerBussinesInfo[]> {
    try {
      const dto = traderDataValidation.traderDataValidation;
      await this.deleteAllTraders();
      const createdTaxPayers = await this.saveTraders(dto);
      return createdTaxPayers;
    } catch (error) {
      throw error;
    }
  }
  private async deleteAllTraders(): Promise<DeleteResult> {
    return this.customerBussinesInfoRepo.delete({});
  }
  private async saveTraders(
    dto: CreateCustomerBussinesInfoDto[],
  ): Promise<CustomerBussinesInfo[]> {
    const traderToSave: CustomerBussinesInfo[] =
      this.customerBussinesInfoRepo.create(dto);
    await this.customerBussinesInfoRepo.insert(traderToSave);
    return traderToSave;
  }
  async getTraderInfoByTinAndTradeLicenseNumber(
    tin: string,
    licenseNumber: string,
  ): Promise<CustomerBussinesInfo | null> {
    try {
      const taxPayer = await this.customerBussinesInfoRepo.findOne({
        where: {
          tin: tin,
          businessLicenseNumber: licenseNumber,
        },
      });
      return taxPayer;
    } catch (error) {
      throw error;
    }
  }

  async fetchCustomerFromJsonFile(): Promise<void> {
    try {
      const filePath = path.join(
        process.cwd(),
        './src/test-data/customer-info.json',
      );
      const configFIle = fs.readFileSync(filePath, 'utf-8').toString();
      const apiData = JSON.parse(configFIle);
      for (const customerBusiness of apiData) {
        await this.customerBussinesInfoRepo.upsert(customerBusiness, {
          skipUpdateIfNoValuesChanged: true,
          conflictPaths: ['tin'],
        });
      }
    } catch (error) {
      throw error;
    }
  }
}
