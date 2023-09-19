import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BankAccountDetailEntity } from "../entities/bank-account-detail.entity";
import { Repository } from "typeorm";
import { VendorsBankDto } from "../dto/bank-vendor.dto";
import { BanksEntity } from "../entities/bank.entity";
import { BankDto } from "../dto/bank.dto";
import { ShareholdersEntity } from "../entities/shareholder.entity";
import { CollectionQuery, QueryConstructor } from "src/shared/collection-query";
import { DataResponseFormat } from "src/shared/api-data";

@Injectable()
export class ShareholderService {
    constructor(
        @InjectRepository(ShareholdersEntity)
        private readonly shareholderrepository: Repository<ShareholdersEntity>,
    ) { }
    async fetch(query: CollectionQuery): Promise<any> {
        try {
            const dataQuery = QueryConstructor.constructQuery<ShareholdersEntity>(
                this.shareholderrepository,
                query,
            );
            const response = new DataResponseFormat<any>();
            if (query.count) {
                response.total = await dataQuery.getCount();
            } else {
                const [result, total] = await dataQuery.getManyAndCount();
                response.total = total;
                response.items = result
            }
            return response;

        } catch (error) {
            throw new HttpException(error, HttpStatus.BAD_REQUEST);
        }
    }
    async getShareholderById(ShareholderId: string): Promise<any> {
        try {
            return await this.shareholderrepository.findOneOrFail({ where: { id: ShareholderId } });
        } catch (error) {
            throw new HttpException(error, HttpStatus.BAD_REQUEST);
        }
    }
    async getShareholdersByVendorId(vendorId: string, query: CollectionQuery): Promise<any> {
        try {
            const dataQuery = QueryConstructor.constructQuery<ShareholdersEntity>(
                this.shareholderrepository,
                query,
            ).andWhere("vendorId = :vendorId", { vendorId: vendorId });
            dataQuery.where('')
            const response = new DataResponseFormat<any>();
            if (query.count) {
                response.total = await dataQuery.getCount();
            } else {
                const [result, total] = await dataQuery.getManyAndCount();
                response.total = total;
                response.items = result
            }
            return response;
            return await this.shareholderrepository.findOneOrFail({ where: { vendorId: vendorId } });
        } catch (error) {
            throw new HttpException(error, HttpStatus.BAD_REQUEST);
        }
    }
}
