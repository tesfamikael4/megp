import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  Param,
  Patch,
  ParseUUIDPipe,
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CreateMandateDto, UpdateMandateDto } from '../dto/mandate.dto';
import { Mandate } from '../entities/mandate.entity';
import { MandateService } from '../services/mandate.service';
import { ApiPaginatedResponse } from 'src/shared/api-data';
import { CollectionQuery } from 'src/shared/collection-query';
import {
  CreateMandatePermissionDto,
  UpdateMandatePermissionDto,
} from '../dto/mandate-permission.dto';

@ApiBearerAuth()
@Controller('mandates')
@ApiTags('mandates')
export class MandateController {
  constructor(private readonly mandateService: MandateService) {}

  @Post('create')
  async create(@Body() createMandateDto: CreateMandateDto) {
    return await this.mandateService.create(createMandateDto);
  }

  @Get('get/:id')
  async findOne(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: string,
    @Query() includes: string[],
    withDeleted: boolean,
  ) {
    return await this.mandateService.findOne(id, includes, withDeleted);
  }

  @Get('get-all')
  @ApiPaginatedResponse(Mandate)
  async findAll(@Query() query: CollectionQuery) {
    return await this.mandateService.findAll(query);
  }
  @Get('get-all-to-assign/:organizationId')
  @ApiPaginatedResponse(Mandate)
  async getMandatesToAssign(
    @Param('organizationId') organizationId: string,
    @Query() query: CollectionQuery,
  ) {
    return await this.mandateService.fetchMandatesToAssign(
      organizationId,
      query,
    );
  }
  @Patch('update/:id')
  async update(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: string,
    @Body() updateMandateDto: UpdateMandateDto,
  ) {
    return await this.mandateService.update(id, updateMandateDto);
  }

  @Delete('delete/:id')
  async remove(@Param('id') id: string) {
    return await this.mandateService.remove(id);
  }
  @Post('assign-permissions/:id')
  @ApiOkResponse({
    type: Mandate,
  })
  async addPermission(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: string,
    @Body() mandatePermissionResponseDto: UpdateMandatePermissionDto[],
  ) {
    const result = await this.mandateService.assignPermissions(
      id,
      mandatePermissionResponseDto,
    );
    return result;
  }
}
