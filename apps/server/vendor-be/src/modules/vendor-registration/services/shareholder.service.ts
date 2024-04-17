import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CollectionQuery, QueryConstructor } from 'src/shared/collection-query';
import { DataResponseFormat } from 'src/shared/api-data';
import { BeneficialOwnershipShares } from 'src/entities';

@Injectable()
export class beneficialOwnershipAndShareholdersService {
  constructor(
    @InjectRepository(BeneficialOwnershipShares)
    private readonly shareholderrepository: Repository<BeneficialOwnershipShares>,
  ) {}
  async fetch(query: CollectionQuery): Promise<any> {
    try {
      const dataQuery =
        QueryConstructor.constructQuery<BeneficialOwnershipShares>(
          this.shareholderrepository,
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
  async getShareholderById(ShareholderId: string): Promise<any> {
    try {
      return await this.shareholderrepository.findOneOrFail({
        where: { id: ShareholderId },
      });
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
  async getShareholdersByVendorId(
    vendorId: string,
    query: CollectionQuery,
  ): Promise<any> {
    try {
      const dataQuery =
        QueryConstructor.constructQuery<BeneficialOwnershipShares>(
          this.shareholderrepository,
          query,
        ).andWhere('vendorId = :vendorId', { vendorId: vendorId });
      dataQuery.where('');
      const response = new DataResponseFormat<any>();
      if (query.count) {
        response.total = await dataQuery.getCount();
      } else {
        const [result, total] = await dataQuery.getManyAndCount();
        response.total = total;
        response.items = result;
      }
      return response;
      return await this.shareholderrepository.findOneOrFail({
        where: { vendorId: vendorId },
      });
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
