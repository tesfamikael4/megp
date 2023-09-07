import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Employee } from '../entities/employee.entity';

export class CreateEmployeeDto {
  @ApiProperty()
  @IsString()
  superTokenUserId: string;

  @ApiProperty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsString()
  organizationId: string;

  static fromDto(employeeDto: CreateEmployeeDto): Employee {
    const employee: Employee = new Employee();

    employee.superTokenUserId = employeeDto.superTokenUserId;

    employee.username = employeeDto.username;

    employee.firstName = employeeDto.firstName;

    employee.lastName = employeeDto.lastName;

    employee.organizationId = employeeDto.organizationId;

    return employee;
  }

  static fromDtos(employeeDto: CreateEmployeeDto[]) {
    return employeeDto?.map((employee) => CreateEmployeeDto.fromDto(employee));
  }
}

export class UpdateEmployeeDto extends CreateEmployeeDto {
  @ApiProperty()
  @IsString()
  id: string;

  static fromDto(employeeDto: UpdateEmployeeDto): Employee {
    const employee: Employee = new Employee();

    employee.id = employeeDto.id;

    employee.superTokenUserId = employeeDto.superTokenUserId;

    employee.username = employeeDto.username;

    employee.firstName = employeeDto.firstName;

    employee.lastName = employeeDto.lastName;

    employee.organizationId = employeeDto.organizationId;

    return employee;
  }
}

export class EmployeeResponseDto extends UpdateEmployeeDto {
  static toDto(employee: Employee): EmployeeResponseDto {
    const employeeDto: EmployeeResponseDto = new EmployeeResponseDto();

    employeeDto.id = employee.id;

    employeeDto.superTokenUserId = employee.superTokenUserId;

    employeeDto.username = employee.username;

    employeeDto.firstName = employee.firstName;

    employeeDto.lastName = employee.lastName;

    employeeDto.organizationId = employee.organizationId;

    return employeeDto;
  }

  static toDtos(employees: Employee[]) {
    return employees?.map((employee) => EmployeeResponseDto.toDto(employee));
  }
}
