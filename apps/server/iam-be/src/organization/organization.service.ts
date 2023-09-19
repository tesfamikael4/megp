import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Organization } from './entities/organization.entity';
import { CollectionQuery, QueryConstructor } from '@collection-query';
import {
  CreateOrganizationDto,
  UpdateOrganizationDto,
  OrganizationResponseDto,
} from './dto/organization.dto';
import { DataResponseFormat } from '@api-data';
import { Unit } from './entities/unit.entity';
import { CreateUnitDto, UpdateUnitDto, UnitResponseDto } from './dto/unit.dto';

import { Employee } from './entities/employee.entity';
import {
  CreateEmployeeDto,
  UpdateEmployeeDto,
  EmployeeResponseDto,
} from './dto/employee.dto';
import { SecurityQuestion } from './entities/security-question.entity';
import {
  CreateOfficeDto,
  OfficeResponseDto,
  UpdateOfficeDto,
} from './dto/office.dto';
import { Office } from './entities/office.entity';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private readonly repository: Repository<Organization>,

    @InjectRepository(Unit)
    private readonly unitRepository: Repository<Unit>,

    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,

    @InjectRepository(Office)
    private readonly officeRepository: Repository<Office>,
  ) {}

  async registerOrganization(user: any, formFields: any) {
    try {
      const [
        email,
        _,
        firstName,
        lastName,
        organizationName,
        securityQuestions,
      ] = formFields;

      const organization = new Organization();
      organization.name = organizationName.value;
      organization.code = this.generateOrganizationCode();
      organization.type = 'Vendor';
      organization.budgetType = 'default';
      organization.employees = [];

      const employee = new Employee();
      employee.superTokenUserId = user.id;
      employee.username = email.value;
      employee.firstName = firstName.value;
      employee.lastName = lastName.value;
      employee.securityQuestions = [];

      const securities = securityQuestions.value;

      securities?.forEach(
        (element: { [s: string]: [s: string] } | ArrayLike<string>) => {
          const entries = Object.entries(element);

          entries?.forEach(([question, answer]) => {
            const securityQuestion = new SecurityQuestion();
            securityQuestion.question = question;
            securityQuestion.answer = answer.toString();

            employee.securityQuestions.push(securityQuestion);
          });
        },
      );

      organization.employees.push(employee);

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
    try {
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
    } catch (error: any) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(id: string): Promise<OrganizationResponseDto | null> {
    try {
      const organizationEntity = await this.repository.findOne({
        where: { id },
      });
      if (!organizationEntity) {
        throw new HttpException('Organization not found', HttpStatus.NOT_FOUND);
      }
      return OrganizationResponseDto.toDto(organizationEntity);
    } catch (error: any) {
      throw error;
    }
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

  async addEmployee(employee: CreateEmployeeDto): Promise<EmployeeResponseDto> {
    try {
      const employeeEntity = CreateEmployeeDto.fromDto(employee);
      await this.employeeRepository.save(employeeEntity);
      return EmployeeResponseDto.toDto(employeeEntity);
    } catch (error: any) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async updateEmployee(
    id: string,
    employee: UpdateEmployeeDto,
  ): Promise<EmployeeResponseDto> {
    try {
      employee.id = id;
      const employeeEntity = UpdateEmployeeDto.fromDto(employee);
      await this.employeeRepository.update({ id: employee.id }, employeeEntity);
      return EmployeeResponseDto.toDto(employeeEntity);
    } catch (error: any) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async removeEmployee(id: string): Promise<void> {
    try {
      await this.employeeRepository.delete({ id: id });
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
      await this.employeeRepository.delete({ id: id });
    } catch (error: any) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async getUserInfo(superTokenUserId: string) {
    try {
      return await this.employeeRepository.findOneBy({ superTokenUserId });
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
}
