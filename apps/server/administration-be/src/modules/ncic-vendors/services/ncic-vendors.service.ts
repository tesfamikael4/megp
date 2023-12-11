import { Injectable } from '@nestjs/common';
import { CreateNcicVendorDto } from '../dto/ncic-vendor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { NcicVendor } from '@entities';
import { DeleteResult, Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { NcicDataValidation } from '../dto/ncic-data-validation';
import { EntityCrudService } from '@generic-services';

@Injectable()
export class NcicVendorsService extends EntityCrudService<NcicVendor> {
  constructor(
    @InjectRepository(NcicVendor)
    private readonly ncicVendorRepository: Repository<NcicVendor>,
  ) {
    super(ncicVendorRepository);
  }
  async createBulkyData(ncicData: NcicDataValidation): Promise<NcicVendor[]> {
    try {
      const dto = ncicData.ncicDataValidation;
      await this.deleteAllNCIC();
      const createdTaxPayers = await this.saveNcic(dto);
      return createdTaxPayers;
    } catch (error) {
      throw error;
    }
  }
  private async deleteAllNCIC(): Promise<DeleteResult> {
    return this.ncicVendorRepository.delete({});
  }
  private async saveNcic(dto: CreateNcicVendorDto[]): Promise<NcicVendor[]> {
    const ncicToSave: NcicVendor[] = this.ncicVendorRepository.create(dto);
    await this.ncicVendorRepository.insert(ncicToSave);
    return ncicToSave;
  }

  async getNCICVenderByTin(tin: string): Promise<NcicVendor | null> {
    try {
      const taxPayer = await this.ncicVendorRepository.findOne({
        where: {
          tin: tin,
        },
      });
      return taxPayer;
    } catch (error) {
      throw error;
    }
  }
  async fetchNCICVendorsFromJsonFile(): Promise<void> {
    try {
      const filePath = path.join(
        process.cwd(),
        './src/test-data/ncic-vendor.json',
      );
      const configFIle = fs.readFileSync(filePath, 'utf-8').toString();
      const apiData = JSON.parse(configFIle);
      await this.ncicVendorRepository.upsert(apiData, {
        skipUpdateIfNoValuesChanged: true,
        conflictPaths: ['tin'],
      });
    } catch (error) {
      throw error;
    }
  }
}
