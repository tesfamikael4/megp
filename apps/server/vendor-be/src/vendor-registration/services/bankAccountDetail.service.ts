import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BankAccountDetailEntity } from "../entities/bank-account-detail.entity";
import { Repository } from "typeorm";
import { VendorsBankDto } from "../dto/bank-vendor.dto";
import { BanksEntity } from "../entities/bank.entity";
import { BankDto } from "../dto/bank.dto";
import { CollectionQuery, QueryConstructor } from "src/shared/collection-query";
import { DataResponseFormat } from "src/shared/api-data";

@Injectable()
export class BankAccountDetailService {
    constructor(
        @InjectRepository(BankAccountDetailEntity)
        private readonly repository: Repository<BankAccountDetailEntity>,
        @InjectRepository(BanksEntity)
        private readonly banksRepository: Repository<BanksEntity>,

    ) { }
    async fetch(query: CollectionQuery): Promise<any> {
        try {
            const dataQuery = QueryConstructor.constructQuery<BankAccountDetailEntity>(
                this.repository,
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
            throw new HttpException(error, HttpStatus.BAD_REQUEST);
        }
    }
    async fetchBank(query: CollectionQuery): Promise<any> {
        try {
            const dataQuery = QueryConstructor.constructQuery<BanksEntity>(
                this.banksRepository,
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
            throw new HttpException(error, HttpStatus.BAD_REQUEST);
        }
    }
    async getBankAccountDetailById(BankAccountDetailById: string): Promise<any> {
        try {
            const bankAccountDetail = await this.repository.findOneOrFail({ where: { id: BankAccountDetailById }, relations: ['bank'] });
            return bankAccountDetail[0];
        } catch (error) {
            throw new HttpException(error, HttpStatus.BAD_REQUEST);
        }
    }
    async getBankAccountDetailByVendorId(vendorId: string, query: CollectionQuery): Promise<any> {
        try {
            const dataQuery = QueryConstructor.constructQuery<BankAccountDetailEntity>(
                this.repository,
                query,
            ).andWhere("vendorId = :vendorId", { vendorId: vendorId });
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
            throw new HttpException(error, HttpStatus.BAD_REQUEST);
        }
    }
    async getBankById(BankId: string): Promise<any> {
        try {
            const bankAccountDetail = await this.banksRepository.findOneOrFail({ where: { id: BankId } });
            return bankAccountDetail[0];
        } catch (error) {
            throw new HttpException(error, HttpStatus.BAD_REQUEST);
        }
    }
    async createBank(bankDto: BankDto): Promise<any> {
        try {
            const bankEntity = BankDto.fromDto(bankDto)
            const bankAccountDetail = await this.repository.save(bankEntity);


            return bankAccountDetail;
        } catch (error) {
            throw new HttpException(error, HttpStatus.BAD_REQUEST);
        }
    }
    async createBankDetail(vendorsBankDto: VendorsBankDto): Promise<any> {
        try {
            const bankDetailEntity = VendorsBankDto.fromDto(vendorsBankDto)
            const bankAccountDetail = await this.repository.save(bankDetailEntity);
            return bankAccountDetail;
        } catch (error) {
            throw new HttpException(error, HttpStatus.BAD_REQUEST);
        }
    }
    async deleteBankDetail(vendorsBankDetailId: string): Promise<any> {
        try {
            const bankAccountDetail = await this.repository.delete(vendorsBankDetailId);
            return bankAccountDetail;
        } catch (error) {
            throw new HttpException(error, HttpStatus.BAD_REQUEST);
        }
    }
    async updateBankDetail(vendorsBankDto: VendorsBankDto): Promise<any> {
        try {
            const bankDetailEntity = VendorsBankDto.fromDto(vendorsBankDto)
            const bankAccountDetail = await this.repository.save(bankDetailEntity);
            return bankAccountDetail;
        } catch (error) {
            throw new HttpException(error, HttpStatus.BAD_REQUEST);
        }
    }
    async deleteBank(vendorsBankId: string): Promise<any> {
        try {
            const bankAccountDetail = await this.banksRepository.delete(vendorsBankId);
            return bankAccountDetail;
        } catch (error) {
            throw new HttpException(error, HttpStatus.BAD_REQUEST);
        }
    }
    async updateBank(bankDto: BankDto): Promise<any> {
        try {
            const bankDetailEntity = BankDto.fromDto(bankDto)
            const bankAccountDetail = await this.banksRepository.save(bankDetailEntity);
            return bankAccountDetail;
        } catch (error) {
            throw new HttpException(error, HttpStatus.BAD_REQUEST);
        }
    }
}
