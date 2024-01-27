import { InjectRepository } from '@nestjs/typeorm';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User, UserRoleSystem, UserUnit } from '@entities';
import { ExtraCrudService } from 'src/shared/service/extra-crud.service';
import { CreateUserDto, InviteUserDto, UserResponseDto } from '../dto/user.dto';
import { AccountsService } from 'src/modules/account/services/account.service';
import { UnitService } from './unit.service';
import { RoleSystemService } from 'src/modules/role-system/services/role-system.service';
import {
  CollectionQuery,
  FilterOperators,
  QueryConstructor,
} from 'src/shared/collection-query';
import { DataResponseFormat } from 'src/shared/api-data';

@Injectable()
export class UserService extends ExtraCrudService<User> {
  constructor(
    @InjectRepository(User)
    private readonly repositoryUser: Repository<User>,
    private readonly accountsService: AccountsService,
    private readonly unitService: UnitService,
    private readonly roleSystemService: RoleSystemService,
  ) {
    super(repositoryUser);
  }

  async create(itemData: CreateUserDto): Promise<any> {
    if (itemData.email) {
      itemData.email = itemData.email.toLowerCase();
    }

    const userExists = await this.repositoryUser.findOne({
      where: {
        organizationId: itemData.organizationId,
        account: {
          email: itemData.email,
        },
      },
    });

    if (userExists) {
      throw new BadRequestException('Conflict');
    }

    const account =
      await this.accountsService.createBackOfficeAccount(itemData);

    itemData.accountId = account.id;
    const item = this.repositoryUser.create(itemData);
    await this.repositoryUser.insert(item);
    return item;
  }

  async getOrganizationAdmins(
    organizationId: string,
    query: CollectionQuery,
  ): Promise<any> {
    query.where.push([
      {
        column: 'organizationId',
        value: organizationId,
        operator: FilterOperators.EqualTo,
      },
    ]);

    query.includes.push('account');

    const ORGANIZATION_ADMINISTRATOR_ROLE_KEY =
      process.env.ORGANIZATION_ADMINISTRATOR_ROLE_KEY ??
      'ORGANIZATION_ADMINISTRATOR';

    const dataQuery = QueryConstructor.constructQuery<User>(
      this.repositoryUser,
      query,
    )
      .leftJoin('users.userRoleSystems', 'userRoleSystems')
      .leftJoin('userRoleSystems.roleSystem', 'roleSystem')
      .andWhere('roleSystem.key=:ORGANIZATION_ADMINISTRATOR_ROLE_KEY', {
        ORGANIZATION_ADMINISTRATOR_ROLE_KEY,
      });

    const response = new DataResponseFormat<UserResponseDto>();
    if (query.count) {
      response.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      response.total = total;
      response.items = UserResponseDto.toDtos(result);
    }
    return response;
  }

  async findAll(organizationId: string, query: CollectionQuery): Promise<any> {
    query.where.push([
      {
        column: 'organizationId',
        value: organizationId,
        operator: FilterOperators.EqualTo,
      },
    ]);

    query.includes.push('account');

    const dataQuery = QueryConstructor.constructQuery<User>(
      this.repositoryUser,
      query,
    );

    const response = new DataResponseFormat<UserResponseDto>();
    if (query.count) {
      response.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      response.total = total;
      response.items = UserResponseDto.toDtos(result);
    }
    return response;
  }

  async findAllUserByPermission(
    organizationId: string,
    permission: string,
    query: CollectionQuery,
  ): Promise<any> {
    query.where.push([
      {
        column: 'organizationId',
        value: organizationId,
        operator: FilterOperators.EqualTo,
      },
    ]);

    query.includes.push('account');

    const dataQuery = QueryConstructor.constructQuery<User>(
      this.repositoryUser,
      query,
    )
      .leftJoin('users.userRoles', 'userRoles')
      .leftJoin('userRoles.role', 'role')
      .leftJoin('role.rolePermissions', 'rolePermissions')
      .leftJoin(
        'rolePermissions.permission',
        'permission',
        'permission.key =:permission',
        { permission },
      )
      .leftJoin('permission.mandatePermissions', 'mandatePermissions')
      .leftJoin('mandatePermissions.mandate', 'mandate')
      .leftJoin('mandate.organizationMandates', 'organizationMandates')

      .leftJoin('users.userRoleSystems', 'userRoleSystems')
      .leftJoin('userRoleSystems.roleSystem', 'roleSystem')
      .leftJoin('roleSystem.roleSystemPermissions', 'roleSystemPermissions')
      .leftJoin(
        'roleSystemPermissions.permission',
        'permissionSystem',
        'permissionSystem.key =:permission',
        { permission },
      )
      .leftJoin(
        'permissionSystem.mandatePermissions',
        'mandatePermissionSystems',
      )
      .leftJoin('mandatePermissionSystems.mandate', 'mandateSystem')
      .leftJoin(
        'mandateSystem.organizationMandates',
        'organizationMandateSystems',
      )
      .andWhere(
        'organizationMandates.organizationId=:organizationIdRole OR organizationMandateSystems.organizationId=:organizationIdRoleSystem',
        {
          organizationIdRole: organizationId,
          organizationIdRoleSystem: organizationId,
        },
      );

    const response = new DataResponseFormat<UserResponseDto>();

    if (query.count) {
      response.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      response.total = total;
      response.items = UserResponseDto.toDtos(result);
    }

    return response;
  }

  async createOrganizationAdmin(itemData: CreateUserDto): Promise<any> {
    if (itemData.email) {
      itemData.email = itemData.email.toLowerCase();
    }

    const userExists = await this.repositoryUser.findOne({
      where: {
        organizationId: itemData.organizationId,
        account: {
          email: itemData.email,
        },
      },
    });

    if (userExists) {
      throw new BadRequestException('Conflict');
    }

    const account =
      await this.accountsService.createBackOfficeAccount(itemData);

    itemData.accountId = account.id;
    const item = this.repositoryUser.create(itemData);

    const unit = await this.unitService.findRootUnit(item.organizationId);
    if (unit) {
      const userUnit = new UserUnit();
      userUnit.unitId = unit.id;

      item.userUnits = [userUnit];
    }

    const roleSystem =
      await this.roleSystemService.getOrganizationAdministratorRole();

    if (roleSystem) {
      const userRoleSystem = new UserRoleSystem();

      userRoleSystem.roleSystemId = roleSystem.id;

      item.userRoleSystems = [userRoleSystem];
    }

    return await this.repositoryUser.save(item);
  }

  async sendInvitation(input: InviteUserDto): Promise<any> {
    try {
      const user = await this.repositoryUser.findOne({
        where: { id: input.id },
        relations: {
          userRoles: true,
          userRoleSystems: true,
          userUnits: true,
        },
      });
      if (!user) {
        throw new HttpException('user_not_found', HttpStatus.NOT_FOUND);
      }

      if (
        (user.userRoles.length < 1 && user.userRoleSystems.length < 1) ||
        user.userUnits.length < 1
      ) {
        throw new HttpException(
          'user_role_and_unit_not_assigned',
          HttpStatus.NOT_FOUND,
        );
      }

      return await this.accountsService.inviteBackOfficeAccount(
        user.accountId,
        user.id,
      );
    } catch (error) {
      throw error;
    }
  }

  async getInvitation(id: string): Promise<any> {
    try {
      const user = await this.repositoryUser.findOneBy({ id });
      if (!user) {
        throw new HttpException('user_not_found', HttpStatus.NOT_FOUND);
      }

      const invite = await this.accountsService.getInvitation(user.accountId);

      const result = {
        id: invite.id,
        otp: invite.otp,
        status: invite.status,
        firstName: invite.account.firstName,
        lastName: invite.account.lastName,
        setPassword: !invite.account.password,
      };

      return result;
    } catch (error) {
      throw error;
    }
  }

  async createDefaultOrganizationUser(input: any, organizationId: string) {
    const { id, ...user } = input;

    user.organizationId = organizationId;
    user.accountId = id;

    await this.repositoryUser.insert(user);
  }

  async findOne(id: any, req?: any): Promise<any> {
    const result = await this.repositoryUser.findOne({
      where: { id },
      relations: { account: true },
    });
    return UserResponseDto.toDto(result);
  }
}
