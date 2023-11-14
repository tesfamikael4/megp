import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BeneficialOwnershipResponse } from '../dto/beneficial-ownership.dto';
import { BeneficialOwnership } from 'src/entities';

@Injectable()
export class BeneficialOwnershipService {
  constructor(
    @InjectRepository(BeneficialOwnership)
    private readonly beneficialOwnershipRepository: Repository<BeneficialOwnership>,
  ) {}

  async fetch(): Promise<BeneficialOwnershipResponse[]> {
    try {
      const result = await this.beneficialOwnershipRepository.find();
      if (!result) {
        throw new NotFoundException(`Vendor Not found`);
      }
      return result.map((element) =>
        BeneficialOwnershipResponse.fromEntity(element),
      );
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
  async getBeneficialOwnershipById(BeneficialOwnershipId: string) {
    try {
      return await this.beneficialOwnershipRepository.findOneOrFail({
        where: { id: BeneficialOwnershipId },
      });
    } catch (error) {}
  }
  async getBeneficialOwnershipByVendorId(
    vendorId: string,
  ): Promise<BeneficialOwnershipResponse[]> {
    try {
      const result = await this.beneficialOwnershipRepository.find({
        where: { vendorId: vendorId },
      });
      if (!result) {
        throw new NotFoundException(
          `BeneficialOwnership for vendor ${vendorId}  is Not found`,
        );
      }
      return result.map((element) =>
        BeneficialOwnershipResponse.fromEntity(element),
      );
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
