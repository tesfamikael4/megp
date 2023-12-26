import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Notification } from "src/entities/notification.entity";
import { EntityCrudService } from "src/shared/service";
import { Repository } from "typeorm";

@Injectable()
export class NotificationsService extends EntityCrudService<Notification>{
    constructor(@InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>) {
        super(notificationRepository);
    }
}