import { CreateOrganizationDto, UpdateOrganizationDto } from './dto/organization.dto';
import { OrganizationService } from './organization.service';
import { CollectionQuery } from '@collection-query';
import { CreateUnitDto, UpdateUnitDto } from './dto/unit.dto';
import { CreateEmployeeDto, UpdateEmployeeDto } from './dto/employee.dto';
export declare class OrganizationController {
    private readonly organizationService;
    constructor(organizationService: OrganizationService);
    create(createOrganizationDto: CreateOrganizationDto): Promise<import("./dto/organization.dto").OrganizationResponseDto>;
    findOne(id: string): Promise<import("./dto/organization.dto").OrganizationResponseDto>;
    findAll(query: CollectionQuery): Promise<import("@api-data").DataResponseFormat<import("./dto/organization.dto").OrganizationResponseDto>>;
    update(id: string, updateOrganizationDto: UpdateOrganizationDto): Promise<import("./dto/organization.dto").OrganizationResponseDto>;
    remove(id: string): Promise<void>;
    addUnit(createUnitDto: CreateUnitDto): Promise<import("./dto/unit.dto").UnitResponseDto>;
    editUnit(id: string, createUnitDto: UpdateUnitDto): Promise<import("./dto/unit.dto").UnitResponseDto>;
    removeUnit(id: string): Promise<void>;
    addEmployee(createEmployeeDto: CreateEmployeeDto): Promise<import("./dto/employee.dto").EmployeeResponseDto>;
    editEmployee(id: string, createEmployeeDto: UpdateEmployeeDto): Promise<import("./dto/employee.dto").EmployeeResponseDto>;
    removeEmployee(id: string): Promise<void>;
}
