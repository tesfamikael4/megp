import { InjectRepository } from '@nestjs/typeorm';
import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Organization } from '@entities';
import {
  CreateOrganizationDto,
  UpdateOrganizationDto,
  OrganizationResponseDto,
  UpdateAddressOrLogoDto,
} from '../dto/organization.dto';

import { EntityCrudService } from 'src/shared/service';
import { AccountsService } from 'src/modules/account/services/account.service';
import { UserService } from './user.service';
@Injectable()
export class OrganizationService extends EntityCrudService<Organization> {
  constructor(
    @InjectRepository(Organization)
    private readonly repositoryOrganization: Repository<Organization>,
    private readonly accountsService: AccountsService,
    private readonly userService: UserService,
  ) {
    super(repositoryOrganization);
  }

  async create(
    organization: CreateOrganizationDto,
  ): Promise<Organization | null> {
    organization.code = this.generateOrganizationCode();
    organization.type = 'BACK-OFFICE';
    organization.budgetType = 'DEFAULT';

    // const account =
    //   await this.accountsService.createDefaultOrganizationAccount(organization);

    const result = await super.create(organization);

    // await this.userService.createDefaultOrganizationUser(account, result.id);

    return result;
  }

  async activate(
    id: string,
    organization: UpdateOrganizationDto,
  ): Promise<OrganizationResponseDto | null> {
    organization.id = id;
    await this.find(id);
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
    organization.id = id;
    await this.find(id);
    const organizationEntity = UpdateAddressOrLogoDto.fromDto(organization);
    Logger.log('save organization works', organizationEntity);
    await this.repositoryOrganization.update({ id: id }, organizationEntity);
    return OrganizationResponseDto.toAddressDto(organizationEntity);
  }

  private async find(id: any): Promise<Organization> {
    const item = await this.findOne(id);
    if (!item) {
      throw new NotFoundException(`not_found`);
    }
    return item;
  }
}
