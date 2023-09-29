import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Organization } from './entities/organization.entity';
import {
  CollectionQuery,
  FilterOperators,
  QueryConstructor,
} from '@collection-query';
import {
  CreateOrganizationDto,
  UpdateOrganizationDto,
  OrganizationResponseDto,
  UpdateAddressOrLogoDto,
} from './dto/organization.dto';
import { DataResponseFormat } from '@api-data';
import { Unit } from './entities/unit.entity';
import { CreateUnitDto, UpdateUnitDto, UnitResponseDto } from './dto/unit.dto';

import {
  CreateOfficeDto,
  OfficeResponseDto,
  UpdateOfficeDto,
} from './dto/office.dto';
import { Office } from './entities/office.entity';
import {
  CreateUserDto,
  UserResponseDto,
  UpdateUserDto,
} from './dto/employee.dto';
import { User } from './entities/user.entity';
import { CreateOrganizationMandateDto } from './dto/organization-mandate.dto';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private readonly repository: Repository<Organization>,

    @InjectRepository(Unit)
    private readonly unitRepository: Repository<Unit>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Office)
    private readonly officeRepository: Repository<Office>,
  ) { }

  async registerOrganization(superTokenUser: any, formFields: any) {
    try {
      const [username, _, organizationName, firstName, lastName, primaryEmail, primaryPhone] = formFields;

      const organization = new Organization();
      organization.name = organizationName.value;
      organization.code = this.generateOrganizationCode();
      organization.type = 'Vendor';
      organization.budgetType = 'default';
      organization.users = [];

      const user = new User();
      user.superTokenUserId = superTokenUser.id;
      user.username = username.value;
      user.firstName = firstName.value;
      user.lastName = lastName.value;
      user.fullName = `${firstName.value} ${lastName.value}`;
      user.email = primaryEmail.value;

      organization.users.push(user);

      await this.repository.save(organization);
    } catch (error: any) {
      console.log(
        '🚀 ~ file: organization.service.ts:64 ~ OrganizationService ~ registerOrganization ~ error:',
        error,
      );
    }
  }

  async create(
    organization: CreateOrganizationDto,
  ): Promise<OrganizationResponseDto | null> {
    try {
      organization.code = this.generateOrganizationCode();
      organization.type = 'Vendor';
      organization.budgetType = 'default';
      const organizationEntity = CreateOrganizationDto.fromDto(organization);
      if (!organizationEntity) {
        throw new HttpException('Organization not found', HttpStatus.NOT_FOUND);
      }
      await this.repository.insert(organizationEntity);
      return OrganizationResponseDto.toDto(organizationEntity);
    } catch (error: any) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async update(
    id: string,
    organization: UpdateOrganizationDto,
  ): Promise<OrganizationResponseDto | null> {
    try {
      organization.id = id;
      const organizationEntity = UpdateOrganizationDto.fromDto(organization);
      if (!organizationEntity) {
        throw new HttpException('Organization not found', HttpStatus.NOT_FOUND);
      }
      await this.repository.update({ id: organization.id }, organizationEntity);
      return OrganizationResponseDto.toDto(organizationEntity);
    } catch (error: any) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async activate(
    id: string,
    organization: UpdateOrganizationDto,
  ): Promise<OrganizationResponseDto | null> {
    try {
      organization.id = id;
      organization.isActive = true;
      const organizationEntity = UpdateOrganizationDto.fromDto(organization);
      if (!organizationEntity) {
        throw new HttpException('Organization not found', HttpStatus.NOT_FOUND);
      }
      await this.repository.update({ id: organization.id }, organizationEntity);
      return OrganizationResponseDto.toDto(organizationEntity);
    } catch (error: any) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(query: CollectionQuery) {
    const dataQuery = QueryConstructor.constructQuery<Organization>(
      this.repository,
      query,
    );
    const response = new DataResponseFormat<OrganizationResponseDto>();
    if (query.count) {
      response.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      response.total = total;
      const items = OrganizationResponseDto.toDtos(result);
      if (items) {
        response.items = items;
      }
    }
    return response;
  }

  async findOne(
    id: string,
    includes: any,
    withDeleted = false,
  ): Promise<OrganizationResponseDto> {
    const organizationEntity = await this.repository.findOne({
      where: { id: id },
      relations: includes.includes,
      withDeleted,
    });
    return OrganizationResponseDto.toDto(organizationEntity);
  }

  async remove(id: string): Promise<void> {
    try {
      await this.repository.delete({ id: id });
    } catch (error: any) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async addUnit(unit: CreateUnitDto): Promise<UnitResponseDto> {
    try {
      const unitEntity = CreateUnitDto.fromDto(unit);
      await this.unitRepository.save(unitEntity);
      return UnitResponseDto.toDto(unitEntity);
    } catch (error: any) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async updateUnit(id: string, unit: UpdateUnitDto): Promise<UnitResponseDto> {
    try {
      unit.id = id;
      const unitEntity = UpdateUnitDto.fromDto(unit);
      await this.unitRepository.update({ id: unit.id }, unitEntity);
      return UnitResponseDto.toDto(unitEntity);
    } catch (error: any) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async removeUnit(id: string): Promise<void> {
    try {
      await this.unitRepository.delete({ id: id });
    } catch (error: any) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async addUser(user: CreateUserDto): Promise<UserResponseDto> {
    try {
      const userEntity = CreateUserDto.fromDto(user);
      await this.userRepository.save(userEntity);
      return UserResponseDto.toDto(userEntity);
    } catch (error: any) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async updateUser(id: string, user: UpdateUserDto): Promise<UserResponseDto> {
    try {
      user.id = id;
      const userEntity = UpdateUserDto.fromDto(user);
      await this.userRepository.update({ id: user.id }, userEntity);
      return UserResponseDto.toDto(userEntity);
    } catch (error: any) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async removeUser(id: string): Promise<void> {
    try {
      await this.userRepository.delete({ id: id });
    } catch (error: any) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async addOffice(office: CreateOfficeDto): Promise<OfficeResponseDto | null> {
    try {
      const officeEntity = CreateOfficeDto.fromDto(office);
      if (!officeEntity) {
        return null;
      }
      await this.officeRepository.save(officeEntity);
      return OfficeResponseDto.toDto(officeEntity);
    } catch (error: any) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async updateOffice(
    id: string,
    office: UpdateOfficeDto,
  ): Promise<OfficeResponseDto | null> {
    try {
      office.id = id;
      const officeEntity = UpdateOfficeDto.fromDto(office);
      if (!officeEntity) {
        return null;
      }
      await this.officeRepository.update({ id: office.id }, officeEntity);
      return OfficeResponseDto.toDto(officeEntity);
    } catch (error: any) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async removeOffice(id: string): Promise<void> {
    try {
      await this.userRepository.delete({ id: id });
    } catch (error: any) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async getUserInfo(superTokenUserId: string) {
    try {
      return await this.userRepository.findOneBy({ superTokenUserId });
    } catch (error: any) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
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
  async assignMandates(
    id: string,
    organizationMandate: CreateOrganizationMandateDto[],
  ): Promise<OrganizationResponseDto> {
    let result: Organization = new Organization();
    const organizationEntity = await this.repository.findOne({
      where: { id },
      relations: ['organizationType', 'sector'],
    });
    const organizationMandates =
      CreateOrganizationMandateDto.fromDtos(organizationMandate);
    organizationEntity.organizationMandates = organizationMandates;
    result = await this.repository.save(organizationEntity);
    return OrganizationResponseDto.toDto(result);
  }
  async setAddress(
    id: string,
    organization: UpdateAddressOrLogoDto,
  ): Promise<OrganizationResponseDto> {
    try {
      organization.id = id;
      const organizationEntity = UpdateAddressOrLogoDto.fromDto(organization);
      Logger.log('save organization works', organizationEntity);
      await this.repository.update({ id: organization.id }, organizationEntity);
      return OrganizationResponseDto.toAddressDto(organizationEntity);
    } catch (error: any) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
