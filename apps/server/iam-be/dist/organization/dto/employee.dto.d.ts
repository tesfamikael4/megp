import { Employee } from '../entities/employee.entity';
export declare class CreateEmployeeDto {
    superTokenUserId: string;
    username: string;
    firstName: string;
    lastName: string;
    organizationId: string;
    static fromDto(employeeDto: CreateEmployeeDto): Employee;
    static fromDtos(employeeDto: CreateEmployeeDto[]): Employee[];
}
export declare class UpdateEmployeeDto extends CreateEmployeeDto {
    id: string;
    static fromDto(employeeDto: UpdateEmployeeDto): Employee;
}
export declare class EmployeeResponseDto extends UpdateEmployeeDto {
    static toDto(employee: Employee): EmployeeResponseDto;
    static toDtos(employees: Employee[]): EmployeeResponseDto[];
}
