import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MessageTemplate } from "src/entities/message-template.entity";
import { EntityCrudService } from "src/shared/service";
import { Repository } from "typeorm";

@Injectable()
export class MessageTemplateService extends EntityCrudService<MessageTemplate>{
    constructor(@InjectRepository(MessageTemplate)
    private readonly messageRepository: Repository<MessageTemplate>) {
        super(messageRepository);
    }
}