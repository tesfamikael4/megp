import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FppaVendor } from '@entities';
import { DataSource, DeleteResult, Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { EntityCrudService } from '@generic-services';
import { FppaDataValidation } from '../dto/fppa-data-validation';
import { CreateFppaVendorDto } from '../dto/fppa-vendor.dto';
import { BusinessArea } from 'src/entities/fppa-business-area.entity';
@Injectable()
export class FppaVendorService extends EntityCrudService<FppaVendor> {
  constructor(
    @InjectRepository(FppaVendor)
    private readonly fppaVendorRepository: Repository<FppaVendor>,
    @InjectRepository(BusinessArea)
    private readonly businessAreaRepository: Repository<BusinessArea>,
    private readonly logger: Logger,
    private dataSource: DataSource,
  ) {
    super(fppaVendorRepository);
  }

  async createBulk(itemData: CreateFppaVendorDto[]) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const chunkSize = 5000;

      const businessArea = [];

      itemData = itemData.map((item) => {
        if (item.goods_category != 'None') {
          const area = this.convertStringToJson(
            item.goods_category,
            item.id,
            'GOODS',
          );
          businessArea.push(area);
        }
        if (item.services_category != 'None') {
          const area = this.convertStringToJson(
            item.services_category,
            item.id,
            'SERVICES',
          );
          businessArea.push(area);
        }
        return item;
      });

      for (let i = 0; i < itemData.length; i += chunkSize) {
        const chunk = itemData.slice(i, i + chunkSize);
        try {
          const bulkChunk = this.fppaVendorRepository.create(chunk as any);
          await this.fppaVendorRepository.upsert(bulkChunk, ['id']);
        } catch (error) {
          throw new BadRequestException(
            `Error processing chunk ${i / chunkSize + 1}: ${error.message}`,
          );
        }
      }

      for (let i = 0; i < businessArea.length; i += chunkSize) {
        const chunk = businessArea.slice(i, i + chunkSize);
        try {
          const bulkChunk = this.businessAreaRepository.create(chunk as any);
          await this.businessAreaRepository.upsert(bulkChunk, [
            'category',
            'fppaVendorId',
          ]);
        } catch (error) {
          throw new BadRequestException(
            `Error processing chunk ${i / chunkSize + 1}: ${error.message}`,
          );
        }
      }
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
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
          companyTin: tin,
        },
        relations: {
          businessAreas: true,
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
      await this.fppaVendorRepository.upsert(apiData, {
        skipUpdateIfNoValuesChanged: true,
        conflictPaths: ['companyTin'],
      });
    } catch (error) {
      throw error;
    }
  }

  private convertStringToJson(
    valueString: string,
    itemId: string,
    businessArea: string,
  ) {
    const parseValue = (valueString) => {
      const match = valueString.match(/(\d+(\.\d+)?)/);
      let value = parseFloat(match[0]);
      if (valueString.includes('Million')) {
        value *= 1e6;
      } else if (valueString.includes('Billion')) {
        value *= 1e9;
      }
      return value;
    };

    const isAbove = valueString.includes('Above');
    const value = parseValue(valueString);
    const valueFrom = isAbove ? value : 1;
    const valueTo = isAbove ? null : value;

    return {
      fppaVendorId: itemId,
      from: valueFrom,
      to: valueTo,
      currency: 'MK',
      tenantId: 0,
      category: businessArea,
    };
  }
}
