import {
    Body,
    Controller,
    Post,
    Param,
    Patch,
    HttpStatus,
    ParseUUIDPipe,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiExtraModels,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { DataResponseFormat } from '@api-data';

import { EntityCrudController } from 'src/shared/controller';
import { EntityCrudOptions } from 'src/shared/types/crud-option.type';
import { JwtGuard } from 'src/shared/authorization';
import { CreateUserPreferenceDto, UpdateUserPreferenceDto } from '../dto/user-preference.dto';
import { UserPreference } from 'src/entities/user-preference.entity';
import { UserPreferenceService } from '../services/user-preference.service';
const options: EntityCrudOptions = {
    createDto: CreateUserPreferenceDto,
    updateDto: UpdateUserPreferenceDto,
};
@ApiBearerAuth()
@Controller('user-preferences')
@UseGuards(JwtGuard)
@ApiTags('User-preferences')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiExtraModels(DataResponseFormat)
export class UserPreferenceController extends EntityCrudController<UserPreference>(
    options,
) {
    constructor(private readonly preferenceService: UserPreferenceService) {
        super(preferenceService);
    }

    @Post()
    async create(@Body() dto: CreateUserPreferenceDto) {
        return await super.create(dto);
    }

    @Patch(':id')
    async update(
        @Param(
            'id',
            new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
        )
        id: string,
        @Body() updateDto: UpdateUserPreferenceDto,
    ) {
        return await super.update(id, updateDto);
    }
}
