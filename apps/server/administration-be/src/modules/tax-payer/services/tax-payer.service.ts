import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaxPayer } from '@entities';
import { DeleteResult, Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { TinValidation } from '../dto/tin-validation.model';
import { EntityCrudService } from 'src/shared/service';
import { TaxpayerData } from '../dto/taxpayer-data-response ';
import axios, { AxiosError } from 'axios';
import { plainToClass } from 'class-transformer';
@Injectable()
export class TaxPayerService extends EntityCrudService<TaxPayer> {
  constructor(
    @InjectRepository(TaxPayer)
    private readonly taxPayerRepo: Repository<TaxPayer>,
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
    issuedDateStr: string,
  ): Promise<TaxpayerData | null | string> {
    try {
      const urlPath = '/ValidateTIN';
      const body = {
        tinNumber: tin,
      };
      const url =
        process.env.BASE_URL_EXTERNAL_API +
        process.env.ADDITIONAL_ROUTE +
        urlPath;
      const headers = {
        UID: process.env.UID,
        APIKEY: process.env.APIKEY,
      };
      const response = await axios.post(url, body, { headers });
      if (response.status === 200) {
        const result = plainToClass(TaxpayerData, response.data);
        const [year, month, day] = issuedDateStr.split('-').map(Number);
        const parsedIssuedDate = new Date(year, month - 1, day);
        if (result && parsedIssuedDate) {
          const issuedDate = new Date(parsedIssuedDate);
          if (!isNaN(issuedDate.getTime())) {
            const registrationDate = new Date(result.registrationDate);
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
              return result;
            } else {
              return 'IssuedDate or TIN is not equal ';
            }
          } else {
            return 'Invalid IssuedDate';
          }
        } else {
          return null;
        }
      } else {
        // Handle non-200 status codes here
        const errorMessage = `api_failed: ${response.status} : ${response.statusText}`;
        throw new Error(errorMessage);
      }
    } catch (error) {
      // Handle network errors, timeouts.
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        const errorMessage = `api_failed: ${
          axiosError.response?.status || 'unknown'
        } : ${axiosError.message}`;
        throw new Error(errorMessage);
      } else {
        throw error;
      }
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
      await this.taxPayerRepo.upsert(apiData, {
        skipUpdateIfNoValuesChanged: true,
        conflictPaths: ['tin'],
      });
    } catch (error) {
      throw error;
    }
  }
}
