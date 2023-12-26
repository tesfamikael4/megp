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
import { CreateMessageTemplateDto, UpdateMessageTemplateDto } from '../dto/message-template.dto';
import { MessageTemplate } from 'src/entities/message-template.entity';
import { MessageTemplateService } from '../services/message-template.service';
const options: EntityCrudOptions = {
    createDto: CreateMessageTemplateDto,
    updateDto: UpdateMessageTemplateDto,
};
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('message-templates')
@ApiTags('message-templates')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiExtraModels(DataResponseFormat)
export class MessageTemplatesController extends EntityCrudController<MessageTemplate>(
    options,
) {
    constructor(private readonly templateService: MessageTemplateService) {
        super(templateService);
    }

    @Post()
    async create(@Body() dto: CreateMessageTemplateDto) {
        return await super.create(dto);
    }

    @Patch(':id')
    async update(
        @Param(
            'id',
            new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
        )
        id: string,
        @Body() updateDto: UpdateMessageTemplateDto,
    ) {
        return await super.update(id, updateDto);
    }
}
