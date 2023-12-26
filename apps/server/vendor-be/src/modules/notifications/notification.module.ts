import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Notification } from "src/entities/notification.entity";
import { AuthorizationModule } from "src/shared/authorization";
import { NotificationsService } from "./services/notification.service";
import { NotificationsController } from "./controllers/notifications.controller";
import { UserPreferenceService } from "./services/user-preference.service";
import { MessageTemplateService } from "./services/message-template.service";
import { MessageTemplatesController } from "./controllers/message-template.controller";
import { UserPreferenceController } from "./controllers/user-preference.controller";
import { UserPreference } from "src/entities/user-preference.entity";
import { MessageTemplate } from "src/entities/message-template.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Notification, UserPreference, MessageTemplate]), AuthorizationModule],
    exports: [NotificationsService],
    providers: [NotificationsService, UserPreferenceService, MessageTemplateService],
    controllers: [NotificationsController, MessageTemplatesController, UserPreferenceController],
})

export class NotificationModule { }