import { Repository } from 'typeorm';
import { Organization } from './entities/organization.entity';
import { CollectionQuery } from '@collection-query';
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
export declare class OrganizationService {
  private readonly repository;
  private readonly unitRepository;
  private readonly employeeRepository;
  constructor(
    repository: Repository<Organization>,
    unitRepository: Repository<Unit>,
    employeeRepository: Repository<Employee>,
  );
  registerOrganization(user: any, formFields: any): Promise<void>;
  create(organization: CreateOrganizationDto): Promise<OrganizationResponseDto>;
  update(
    id: string,
    organization: UpdateOrganizationDto,
  ): Promise<OrganizationResponseDto>;
  findAll(
    query: CollectionQuery,
  ): Promise<DataResponseFormat<OrganizationResponseDto>>;
  findOne(id: string): Promise<OrganizationResponseDto>;
  remove(id: string): Promise<void>;
  addUnit(unit: CreateUnitDto): Promise<UnitResponseDto>;
  updateUnit(id: string, unit: UpdateUnitDto): Promise<UnitResponseDto>;
  removeUnit(id: string): Promise<void>;
  addEmployee(employee: CreateEmployeeDto): Promise<EmployeeResponseDto>;
  updateEmployee(
    id: string,
    employee: UpdateEmployeeDto,
  ): Promise<EmployeeResponseDto>;
  removeEmployee(id: string): Promise<void>;
}
