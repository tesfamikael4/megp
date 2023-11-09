import { Module } from "@nestjs/common";
import { BpServiceEntity } from "./entities/bp-service";
import { BpServiceService } from "./service.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BpServiceController } from "./bp-service.controller";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            BpServiceEntity,
        ])
    ],
    exports: [
        BpServiceService,

    ],
    providers: [
        BpServiceService,

    ],
    controllers: [
        BpServiceController
    ],
})
export class BpmModule { }
