import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FppaVendor } from '@entities';
import { DeleteResult, Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { EntityCrudService } from '@generic-services';
import { FppaDataValidation } from '../dto/fppa-data-validation';
@Injectable()
export class FppaVendorService extends EntityCrudService<FppaVendor> {
  constructor(
    @InjectRepository(FppaVendor)
    private readonly fppaVendorRepository: Repository<FppaVendor>,
    private readonly logger: Logger,
  ) {
    super(fppaVendorRepository);
  }

  async createBulkyData(
    fppaValidation: FppaDataValidation,
  ): Promise<FppaVendor[]> {
    try {
      const dto = fppaValidation.fppaDataValidation;
      await this.fppaVendorRepository.find();
      await this.deleteAllFPPA();
      const createdTaxPayers = await this.saveFPPA(dto);
      return createdTaxPayers;
    } catch (error) {
      throw error;
    }
  }

  private async deleteAllFPPA(): Promise<DeleteResult> {
    return this.fppaVendorRepository.delete({});
  }

  private async saveFPPA(dto: FppaVendor[]): Promise<FppaVendor[]> {
    const fppaToSave: FppaVendor[] = this.fppaVendorRepository.create(dto);
    await this.fppaVendorRepository.insert(fppaToSave);
    return fppaToSave;
  }

  async getFPPAVenderByTin(tin: string): Promise<FppaVendor | null> {
    try {
      const taxPayer = await this.fppaVendorRepository.findOne({
        where: {
          tin: tin,
        },
      });
      return taxPayer;
    } catch (error) {
      throw error;
    }
  }

  async fetchFPPAVendorsFromJsonFile(): Promise<void> {
    try {
      const filePath = path.join(
        process.cwd(),
        './src/test-data/fppa-vendor.json',
      );
      const configFIle = fs.readFileSync(filePath, 'utf-8').toString();
      const apiData = JSON.parse(configFIle);
      for (const item of apiData) {
        await this.fppaVendorRepository.upsert(item, {
          skipUpdateIfNoValuesChanged: true,
          conflictPaths: ['tin'],
        });
      }
    } catch (error) {
      throw error;
    }
  }
}
