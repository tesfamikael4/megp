import { InjectRepository } from '@nestjs/typeorm';
import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { Organization, Unit } from '@entities';
import {
  CreateOrganizationDto,
  OrganizationResponseDto,
  UpdateAddressOrLogoDto,
} from '../dto/organization.dto';

import { EntityCrudService } from 'src/shared/service';
import { RoleService } from 'src/modules/role/services/role.service';
import { REQUEST } from '@nestjs/core';
import { ENTITY_MANAGER_KEY } from '@interceptors';

@Injectable()
export class OrganizationService extends EntityCrudService<Organization> {
  constructor(
    @InjectRepository(Organization)
    private readonly repositoryOrganization: Repository<Organization>,
    private readonly roleService: RoleService,
    @Inject(REQUEST) private request: Request,
  ) {
    super(repositoryOrganization);
  }

  async transactionTest(organizationDto: CreateOrganizationDto) {
    const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];

    const organization = manager
      .getRepository(Organization)
      .create(organizationDto);
    await manager.getRepository(Organization).insert(organization);

    const unit = new Unit();
    unit.name = organization.name;
    unit.description = organization.description;
    unit.code = organization.code;
    unit.organizationId = organization.id;
    await manager.getRepository(Unit).insert(unit);
    await manager.getRepository(Unit).insert(unit);
  }

  async create(
    organizationDto: CreateOrganizationDto,
  ): Promise<Organization | null> {
    const organization = this.repositoryOrganization.create(organizationDto);
    organization.code = this.generateOrganizationCode();
    organization.type = 'BACK-OFFICE';
    organization.budgetType = 'DEFAULT';

    const unit = new Unit();
    unit.name = organization.name;
    unit.description = organization.description;
    unit.code = organization.code;

    organization.units = [unit];

    const result = await this.repositoryOrganization.save(organization);

    return result;
  }

  async activate(id: string): Promise<OrganizationResponseDto | null> {
    const organization = await this.find(id);

    organization.isActive = true;
    await this.repositoryOrganization.update(id, organization);

    return OrganizationResponseDto.toDto(organization);
  }

  private generateOrganizationCode() {
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
    organizationDto: UpdateAddressOrLogoDto,
  ): Promise<OrganizationResponseDto> {
    const organization = await this.find(id);

    organization.address = organizationDto.address;
    organization.logo = organizationDto.logo;

    await this.repositoryOrganization.update(id, organization);
    return OrganizationResponseDto.toDto(organization);
  }

  private async find(id: any): Promise<Organization> {
    const item = await this.findOne(id);
    if (!item) {
      throw new NotFoundException(`not_found`);
    }
    return item;
  }
}
