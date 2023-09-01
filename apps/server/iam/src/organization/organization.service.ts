import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository, } from 'typeorm';
import { Organization } from './entities/organization.entity';
import { CollectionQuery, FilterOperators, QueryConstructor } from '@collection-query';
import { CreateOrganizationDto, UpdateOrganizationDto, OrganizationResponseDto } from './dto/organization.dto';
import { DataResponseFormat } from '@api-data';
import { Unit } from './entities/unit.entity';
import { CreateUnitDto, UpdateUnitDto, UnitResponseDto } from './dto/unit.dto';

import { Employee } from './entities/employee.entity';
import { CreateEmployeeDto, UpdateEmployeeDto, EmployeeResponseDto } from './dto/employee.dto';
import { SecurityQuestion } from './entities/security-question.entity';
import { stringify } from 'querystring';



@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private readonly repository: Repository<Organization>,

    @InjectRepository(Unit)
    private readonly unitRepository: Repository<Unit>,

    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) { }

  async registerOrganization(user: any, formFields: any) {
    try {
      const [email, password, firstName, lastName, organizationName, securityQuestions] = formFields;

      const organization = new Organization();
      organization.name = organizationName.value;
      organization.code = "00001";
      organization.type = "Vendor";
      organization.employees = [];

      const employee = new Employee();
      employee.superTokenUserId = user.id;
      employee.username = email.value;
      employee.firstName = firstName.value;
      employee.lastName = lastName.value;
      employee.securityQuestions = [];

      const securities = securityQuestions.value;

      securities?.forEach(element => {
        let entries = Object.entries(element);

        entries?.forEach(([question, answer]) => {
          let securityQuestion = new SecurityQuestion();
          securityQuestion.question = question;
          securityQuestion.answer = answer.toString();

          employee.securityQuestions.push(securityQuestion);
        });

      });

      organization.employees.push(employee);

      await this.repository.save(organization);
    } catch (error) {
      console.log("🚀 ~ file: organization.service.ts:64 ~ OrganizationService ~ registerOrganization ~ error:", error)
    }
  }

  async create(organization: CreateOrganizationDto): Promise<OrganizationResponseDto> {
    try {
      const organizationEntity = CreateOrganizationDto.fromDto(organization);
      await this.repository.save(organizationEntity);
      return OrganizationResponseDto.toDto(organizationEntity);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: string, organization: UpdateOrganizationDto): Promise<OrganizationResponseDto> {
    try {
      organization.id = id;
      const organizationEntity = UpdateOrganizationDto.fromDto(organization);
      await this.repository.update({ id: organization.id }, organizationEntity);
      return OrganizationResponseDto.toDto(organizationEntity);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(query: CollectionQuery) {

    try {

      const dataQuery = QueryConstructor.constructQuery<Organization>(
        this.repository,
        query
      );
      const response = new DataResponseFormat<OrganizationResponseDto>();
      if (query.count) {
        response.total = await dataQuery.getCount();
      } else {
        const [result, total] = await dataQuery.getManyAndCount();
        response.total = total;
        response.items = OrganizationResponseDto.toDtos(result);
      }
      return response;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(id: string): Promise<OrganizationResponseDto> {
    try {
      const organizationEntity = await this.repository.findOne({ where: { id } });
      return OrganizationResponseDto.toDto(organizationEntity);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.repository.delete({ id: id });
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async addUnit(unit: CreateUnitDto): Promise<UnitResponseDto> {
    try {
      const unitEntity = CreateUnitDto.fromDto(unit);
      await this.unitRepository.save(unitEntity);
      return UnitResponseDto.toDto(unitEntity);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async updateUnit(id: string, unit: UpdateUnitDto): Promise<UnitResponseDto> {
    try {
      unit.id = id;
      const unitEntity = UpdateUnitDto.fromDto(unit);
      await this.unitRepository.update({ id: unit.id }, unitEntity);
      return UnitResponseDto.toDto(unitEntity);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async removeUnit(id: string): Promise<void> {
    try {
      await this.unitRepository.delete({ id: id });
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async addEmployee(employee: CreateEmployeeDto): Promise<EmployeeResponseDto> {
    try {
      const employeeEntity = CreateEmployeeDto.fromDto(employee);
      await this.employeeRepository.save(employeeEntity);
      return EmployeeResponseDto.toDto(employeeEntity);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async updateEmployee(id: string, employee: UpdateEmployeeDto): Promise<EmployeeResponseDto> {
    try {
      employee.id = id;
      const employeeEntity = UpdateEmployeeDto.fromDto(employee);
      await this.employeeRepository.update({ id: employee.id }, employeeEntity);
      return EmployeeResponseDto.toDto(employeeEntity);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async removeEmployee(id: string): Promise<void> {
    try {
      await this.employeeRepository.delete({ id: id });
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

}