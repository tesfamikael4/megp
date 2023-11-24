import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaxPayer } from '@entities';
import { DeleteResult, Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { CommonHttpService } from '@common-http';
import { TinValidation } from '../dto/tin-validation.model';
import { EntityCrudService } from 'src/shared/service';
import { TaxpayerData } from '../dto/taxpayer-data-response ';
@Injectable()
export class TaxPayerService extends EntityCrudService<TaxPayer> {
  constructor(
    @InjectRepository(TaxPayer)
    private readonly taxPayerRepo: Repository<TaxPayer>,
    private readonly commonHttpService: CommonHttpService,
  ) {
    super(taxPayerRepo);
  }

  async createBulkyData(tinValidation: TinValidation): Promise<TaxPayer[]> {
    try {
      const taxPayerDtos = tinValidation.tinValidation;
      await this.deleteAllTaxPayers();
      const createdTaxPayers = await this.saveTaxPayers(taxPayerDtos);
      return createdTaxPayers;
    } catch (error) {
      throw error;
    }
  }
  private async deleteAllTaxPayers(): Promise<DeleteResult> {
    return this.taxPayerRepo.delete({});
  }
  private async saveTaxPayers(taxPayerDtos: TaxPayer[]): Promise<TaxPayer[]> {
    const taxPayersToSave: TaxPayer[] = this.taxPayerRepo.create(taxPayerDtos);
    await this.taxPayerRepo.save(taxPayersToSave);
    return taxPayersToSave;
  }

  async getVenderByTinAndIssuedDate(
    tin: string,
    issuedDateStr: Date,
  ): Promise<TaxpayerData | null | string> {
    try {
      const urlPath = '/ValidateTIN';
      const body = {
        tinNumber: tin,
      };
      const response = await this.commonHttpService.sendPostRequest(
        urlPath,
        body,
      );
      if (response) {
        if (issuedDateStr) {
          const issuedDate = new Date(issuedDateStr);
          if (!isNaN(issuedDate.getTime())) {
            const registrationDate = new Date(response.registrationDate);
            const issuedDateWithoutTime = new Date(
              issuedDate.getFullYear(),
              issuedDate.getMonth(),
              issuedDate.getDate(),
            );
            const registrationDateWithoutTime = new Date(
              registrationDate.getFullYear(),
              registrationDate.getMonth(),
              registrationDate.getDate(),
            );

            if (
              issuedDateWithoutTime.getTime() ===
              registrationDateWithoutTime.getTime()
            ) {
              return response.data;
            } else {
              return 'IssuedDate or TIN is not equal ';
            }
          } else {
            return 'Invalid IssuedDate';
          }
        } else {
          return 'IssuedDate is missing';
        }
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
  }

  async fetchTaxPayerFromJsonFile(): Promise<void> {
    try {
      const filePath = path.join(
        process.cwd(),
        './src/test-data/tax-payer.json',
      );
      const configFIle = fs.readFileSync(filePath, 'utf-8').toString();
      const apiData = JSON.parse(configFIle);
      for (const apiTaxPayer of apiData) {
        await this.taxPayerRepo.upsert(apiTaxPayer, {
          skipUpdateIfNoValuesChanged: true,
          conflictPaths: ['tin'],
        });
      }
    } catch (error) {
      throw error;
    }
  }
}
