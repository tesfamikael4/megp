import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { EntityCrudService } from 'src/shared/service';
import { BusinessAreaResponseDto } from '../dto/business-area.dto';
import { BusinessAreaEntity } from 'src/entities';
import { WorkflowInstanceEnum } from 'src/modules/handling/dto/workflow-instance.enum';
import { userInfo } from 'os';

@Injectable()
export class BusinessAreaService extends EntityCrudService<BusinessAreaEntity> {
  constructor(
    @InjectRepository(BusinessAreaEntity)
    private readonly businessAreaRepository: Repository<BusinessAreaEntity>,
  ) {
    super(businessAreaRepository);
  }
  async getByVendorId(vendorId: string): Promise<BusinessAreaResponseDto> {
    try {
      return BusinessAreaResponseDto.fromDto(
        await this.businessAreaRepository.findOneOrFail({
          where: { vendorId: vendorId },
        }),
      );
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
  async getBusinessAreaWithPrice(id: string): Promise<BusinessAreaEntity> {
    return this.businessAreaRepository.findOne({
      where: { id: id },
      relations: { servicePrice: true },
    });
  }
  async getBusinessAreaWithPendingInvoice(ids: string[], keys: string[], user: any): Promise<BusinessAreaEntity[]> {
    return this.businessAreaRepository.find({
      where: {
        id: In(ids),
        status: 'Pending', invoice: { paymentStatus: 'Pending', userId: user.id }
      },
      relations: { servicePrice: true, invoice: true, BpService: true },
    });
  }
  async getBusinessAreaByInstanceId(instanceId: string): Promise<BusinessAreaEntity> {
    return this.businessAreaRepository.findOne({
      where: { instanceId: instanceId }

    });
  }

  async getBusinessAreaByIds(businessIds: string[]): Promise<BusinessAreaEntity[]> {
    return this.businessAreaRepository.find({
      where: { id: In(businessIds), status: WorkflowInstanceEnum.Approved }

    });

  }
  async getBusinessAreaByInstanceIds(instanceIds: string[]): Promise<BusinessAreaEntity[]> {
    return this.businessAreaRepository.find({
      where: {
        instanceId: In(instanceIds),
        status: 'Pending',
        invoice: { paymentStatus: 'Pending' }
      },
      relations: { invoice: true }

    });
  }


}
