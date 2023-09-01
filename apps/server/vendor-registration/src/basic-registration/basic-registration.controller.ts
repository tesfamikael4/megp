import { Body, Controller, Delete, Get, Post, Put, Query, Param, Patch, ParseUUIDPipe, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ApiPaginatedResponse } from '@api-data';
import { CollectionQuery, } from '@collection-query';
import { CreateBasicRegistrationDto, UpdateBasicRegistrationDto } from './dto/basic-registration.dto';
import { CreateSecurityQuestionDto, UpdateSecurityQuestionDto } from './dto/security-question.dto';
import { BasicRegistrationService } from './basic-registration.service';
import { BasicRegistration } from './entities/basic-registration.entity';


@ApiBearerAuth()
@Controller('basic-registrations')
@ApiTags('basic-registrations')
export class BasicRegistrationController {

  constructor(private readonly basicRegistrationService: BasicRegistrationService) { }

  @Post()
  async create(@Body() createBasicRegistrationDto: CreateBasicRegistrationDto) {
    return await this.basicRegistrationService.create(createBasicRegistrationDto);
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: string) {
    return await this.basicRegistrationService.findOne(id);
  }

  @Get()
  @ApiPaginatedResponse(BasicRegistration)
  @ApiOkResponse({ type: BasicRegistration, isArray: false })
  async findAll(@Query() query: CollectionQuery) {
    return await this.basicRegistrationService.findAll(query);
  }


  @Patch(':id')
  async update(@Param('id', new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: string, @Body() updateBasicRegistrationDto: UpdateBasicRegistrationDto) {
    return await this.basicRegistrationService.update(id, updateBasicRegistrationDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.basicRegistrationService.remove(id);
  }

  @Post('add-security-question')
  async addSecurityQuestion(@Body() createSecurityQuestionDto: CreateSecurityQuestionDto) {
    return await this.basicRegistrationService.addSecurityQuestion(createSecurityQuestionDto);
  }

  @Patch('update-security-question/:id')
  async editSecurityQuestion(@Param('id', new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: string, @Body() createSecurityQuestionDto: UpdateSecurityQuestionDto) {
    return await this.basicRegistrationService.updateSecurityQuestion(id, createSecurityQuestionDto);
  }

  @Delete('remove-security-question/:id')
  async removeSecurityQuestion(@Param('id', new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: string) {
    return await this.basicRegistrationService.removeSecurityQuestion(id);
  }

}