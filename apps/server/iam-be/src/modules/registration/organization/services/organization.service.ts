import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Organization } from '../entities/organization.entity';
import {
  CreateOrganizationDto,
  UpdateOrganizationDto,
  OrganizationResponseDto,
  UpdateAddressOrLogoDto,
} from '../dto/organization.dto';

import { EntityCrudService } from 'src/shared/service';
@Injectable()
export class OrganizationService extends EntityCrudService<Organization> {
  constructor(
    @InjectRepository(Organization)
    private readonly repositoryOrganization: Repository<Organization>,
  ) {
    super(repositoryOrganization);
  }

  async create(organization: Organization): Promise<Organization | null> {
    organization.code = this.generateOrganizationCode();
    organization.type = 'Vendor';
    organization.budgetType = 'default';
    const organizationEntity = CreateOrganizationDto.fromDto(organization);
    return await super.create(organizationEntity);
  }

  async activate(
    id: string,
    organization: UpdateOrganizationDto,
  ): Promise<OrganizationResponseDto | null> {
    organization.id = id;
    organization.isActive = true;
    const organizationEntity = UpdateOrganizationDto.fromDto(organization);
    await this.repositoryOrganization.update(
      { id: organization.id },
      organizationEntity,
    );
    return OrganizationResponseDto.toDto(organizationEntity);
  }

  private generateOrganizationCode() {
    //generate random string?
    const length = 6;
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  generateUsername() {
    const result = `me-${Math.floor(Date.now() / 1000)}-${Math.floor(
      Math.random() * 1000000000,
    ).toString()}`;
    return result;
  }
  async setAddress(
    id: string,
    organization: UpdateAddressOrLogoDto,
  ): Promise<OrganizationResponseDto> {
    try {
      organization.id = id;
      const organizationEntity = UpdateAddressOrLogoDto.fromDto(organization);
      Logger.log('save organization works', organizationEntity);
      await this.repositoryOrganization.update(
        { id: organization.id },
        organizationEntity,
      );
      return OrganizationResponseDto.toAddressDto(organizationEntity);
    } catch (error: any) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
