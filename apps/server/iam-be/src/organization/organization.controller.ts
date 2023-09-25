import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  Param,
  Patch,
  ParseUUIDPipe,
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ApiPaginatedResponse } from '@api-data';
import {
  CreateOrganizationDto,
  UpdateOrganizationDto,
} from './dto/organization.dto';
import { OrganizationService } from './organization.service';
import { Organization } from './entities/organization.entity';
import { CollectionQuery } from '@collection-query';
import { CreateUnitDto, UpdateUnitDto } from './dto/unit.dto';
import { CreateEmployeeDto, UpdateEmployeeDto } from './dto/employee.dto';
import { CreateOfficeDto, UpdateOfficeDto } from './dto/office.dto';
import { AllowAnonymous } from 'src/supertokens/auth/decorators';

@ApiBearerAuth()
@Controller('organizations')
@ApiTags('organizations')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Post()
  async create(@Body() createOrganizationDto: CreateOrganizationDto) {
    return await this.organizationService.create(createOrganizationDto);
  }

  @Get(':id')
  async findOne(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: string,
  ) {
    return await this.organizationService.findOne(id);
  }

  @Get()
  @ApiPaginatedResponse(Organization)
  @ApiOkResponse({ type: Organization, isArray: false })
  @AllowAnonymous()
  async findAll(@Query() query: CollectionQuery) {
    return await this.organizationService.findAll(query);
  }

  @Patch(':id')
  async update(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: string,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
  ) {
    return await this.organizationService.update(id, updateOrganizationDto);
  }

  @Patch(':id')
  async activate(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: string,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
  ) {
    return await this.organizationService.update(id, updateOrganizationDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.organizationService.remove(id);
  }

  @Post('add-unit')
  async addUnit(@Body() createUnitDto: CreateUnitDto) {
    return await this.organizationService.addUnit(createUnitDto);
  }

  @Patch('update-unit/:id')
  async editUnit(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: string,
    @Body() createUnitDto: UpdateUnitDto,
  ) {
    return await this.organizationService.updateUnit(id, createUnitDto);
  }

  @Delete('remove-unit/:id')
  async removeUnit(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: string,
  ) {
    return await this.organizationService.removeUnit(id);
  }

  @Post('add-employee')
  async addEmployee(@Body() createEmployeeDto: CreateEmployeeDto) {
    return await this.organizationService.addEmployee(createEmployeeDto);
  }

  @Patch('update-employee/:id')
  async editEmployee(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: string,
    @Body() createEmployeeDto: UpdateEmployeeDto,
  ) {
    return await this.organizationService.updateEmployee(id, createEmployeeDto);
  }

  @Delete('remove-employee/:id')
  async removeEmployee(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: string,
  ) {
    return await this.organizationService.removeEmployee(id);
  }

  @Post('add-office')
  async addOffice(@Body() createOfficeDto: CreateOfficeDto) {
    return await this.organizationService.addOffice(createOfficeDto);
  }

  @Patch('update-office/:id')
  async editOffice(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: string,
    @Body() createOfficeDto: UpdateOfficeDto,
  ) {
    return await this.organizationService.updateOffice(id, createOfficeDto);
  }

  @Delete('remove-office/:id')
  async removeOffice(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: string,
  ) {
    return await this.organizationService.removeOffice(id);
  }
}
