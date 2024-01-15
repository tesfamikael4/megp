import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { PreferentialTreatmentsEntity } from 'src/entities/preferential-treatment.entity';
export class CreatePTDto {
    id: string;
    @ApiProperty()
    @IsNotEmpty()
    vendorId: string;
    @ApiProperty()
    @IsNotEmpty()
    serviceId: string;
    @ApiProperty()
    @IsNotEmpty()
    status: string;
    @ApiProperty()
    @IsOptional()
    extendedProfile: any;
    @ApiProperty()
    @IsOptional()
    attachments: any;
    @ApiProperty()
    @IsNotEmpty()
    remark: string;

    /**
     * Transfer Data from DTO object to Entity object
     *
     */
    static fromDto(dto: CreatePTDto): PreferentialTreatmentsEntity {
        const entity = new PreferentialTreatmentsEntity();
        if (!dto) {
            return;
        }
        entity.vendorId = dto.vendorId;
        entity.serviceId = dto.serviceId;
        entity.remark = dto.remark;
        entity.extendedProfile = dto.extendedProfile;
        return entity;
    }
}
export class UpdatePTDto extends CreatePTDto {
    @ApiProperty()
    @IsUUID()
    id: string;
    static fromDto(dto: UpdatePTDto): PreferentialTreatmentsEntity {
        const entity = new PreferentialTreatmentsEntity();
        if (!dto) {
            return;
        }
        entity.vendorId = dto.vendorId;
        entity.serviceId = dto.serviceId;
        entity.remark = dto.remark;
        entity.extendedProfile = dto.extendedProfile;
        return entity;
    }
}
export class PTResponse extends UpdatePTDto {
    createdAt: Date;
    @ApiProperty()
    status: string;
    @ApiProperty()
    attachments: any;
    static toResponse(entity: PreferentialTreatmentsEntity): PTResponse {
        const response = new PTResponse();
        response.vendorId = entity.vendorId;
        response.serviceId = entity.serviceId;
        response.remark = entity.remark;
        response.extendedProfile = entity.extendedProfile;
        response.attachments = entity.attachments;
        response.status = entity.status;
        return response;
    }
}
