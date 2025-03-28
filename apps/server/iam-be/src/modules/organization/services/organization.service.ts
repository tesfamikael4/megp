import { InjectRepository } from '@nestjs/typeorm';
import {
  BadRequestException,
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { Organization, Role, Unit, User } from '@entities';
import {
  CreateOrganizationDto,
  OrganizationResponseDto,
  UpdateAddressOrLogoDto,
  VendorRegistrationCompletedEvent,
} from '../dto/organization.dto';
import { EntityCrudService } from 'src/shared/service';
import { REQUEST } from '@nestjs/core';
import { ENTITY_MANAGER_KEY } from '@interceptors';
import { defaultOrganizationRoles } from 'src/modules/seeders/seed-data';
import { AccountsService } from 'src/modules/account/services/account.service';
import { OrganizationStatus, UserStatus } from 'src/shared/enums';
import { RoleSystemService } from 'src/modules/role-system/services/role-system.service';
import { CollectionQuery, QueryConstructor } from 'src/shared/collection-query';
import { DataResponseFormat } from 'src/shared/api-data';

@Injectable()
export class OrganizationService extends EntityCrudService<Organization> {
  constructor(
    @InjectRepository(Organization)
    private readonly repositoryOrganization: Repository<Organization>,
    @InjectRepository(User)
    private readonly repositoryUser: Repository<User>,
    private readonly accountService: AccountsService,
    private readonly roleSystemService: RoleSystemService,
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
    try {
      const organization = this.repositoryOrganization.create(organizationDto);
      organization.code = this.generateOrganizationCode();
      organization.type = 'BACK-OFFICE';

      const unit = new Unit();
      unit.name = organization.name;
      unit.description = organization.description;
      unit.code = organization.code;

      organization.units = [unit];

      const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];

      const defaultRoles = manager
        .getRepository(Role)
        .create(defaultOrganizationRoles);

      organization.roles = defaultRoles;

      const result = await this.repositoryOrganization.save(organization);

      return result;
    } catch (error) {
      if (error.code == '23505') {
        throw new HttpException('organization already exists', 409);
      }

      throw error;
    }
  }

  async activate(id: string): Promise<Organization | null> {
    const organization = await this.repositoryOrganization.findOne({
      where: { id },
      relations: ['organizationMandates'],
    });

    if (organization.organizationMandates.length === 0) {
      throw new BadRequestException(`no_mandate_found`);
    }

    const roleSystem = await this.roleSystemService.getAdminRole(
      process.env.ORGANIZATION_ADMINISTRATOR_KEY ??
        'ORGANIZATION_ADMINISTRATOR',
    );

    const orgAdmin = await this.repositoryUser.findOne({
      where: {
        organizationId: id,
        userRoleSystems: {
          roleSystemId: roleSystem.id,
        },
      },
      select: {
        id: true,
      },
    });

    if (!orgAdmin) throw new NotFoundException('organization_admin_not_found');

    await this.repositoryOrganization.update(id, {
      status: OrganizationStatus.ACTIVE,
    });

    organization.status = OrganizationStatus.ACTIVE;

    return organization;
  }

  async findAllOrganizationByMandate(
    mandateKey: string,
    query: CollectionQuery,
  ) {
    const dataQuery = QueryConstructor.constructQuery<Organization>(
      this.repositoryOrganization,
      query,
    )
      .leftJoin('organizations.organizationMandates', 'organizationMandates')
      .leftJoin('organizationMandates.mandate', 'mandate')
      .andWhere('mandate.key = :mandateKey', { mandateKey: mandateKey });

    const response = new DataResponseFormat<Organization>();
    if (query.count) {
      response.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      response.total = total;
      response.items = result;
    }
    return response;
  }

  async isBudgetCheckNeeded(id: string): Promise<boolean> {
    return await this.repositoryOrganization.exists({
      where: { id, budgetCheckNeeded: true },
    });
  }
  async getVoteCode(id: string): Promise<any> {
    return await this.repositoryOrganization.findOne({
      where: { id },
      select: {
        voteCode: true,
      },
    });
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

  async vendorRegistrationCompleted(payload: VendorRegistrationCompletedEvent) {
    const account = await this.accountService.getAccountById(payload.accountId);

    const organizationDto = {
      id: payload.id,
      name: payload.name,
      shortName: payload.name,
      code: payload.egpRegistrationNumber,
      type: 'PORTAL',
      status: OrganizationStatus.ACTIVE,
    };
    const organization = this.repositoryOrganization.create(organizationDto);

    const unit = new Unit();
    unit.name = organization.name;
    unit.description = organization.description;
    unit.code = organization.code;

    organization.units = [unit];

    const user = new User();
    user.accountId = account.id;
    user.status = UserStatus.ACTIVE;

    organization.users = [user];

    await this.repositoryOrganization.save(organization);
  }
}
