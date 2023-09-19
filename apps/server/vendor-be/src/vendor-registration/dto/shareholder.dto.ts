import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { ApplicationEntity } from '../entities/application.entity';
import { CreateBusinessCategoryDto } from './business-category.dto';
import { CreateCustomCategoryDto } from './custom-category.dto';
import { CreateVendorsDto } from './vendor.dto';
import { ShareholdersEntity } from '../entities/shareholder.entity';

export class CreateShareholdersDto {
    id: string;
    @ApiProperty()
    @IsNotEmpty()
    fullName: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsUUID()
    Nationality: string; //new renew  Upgrade
    @ApiProperty()
    @IsNotEmpty()
    Share: string;

    vendorId: string;

    /**
     * Transfer Data from DTO object to Entity object
     *
     */
    static fromDto(dto: CreateShareholdersDto): ShareholdersEntity {
        const entity = new ShareholdersEntity();
        if (!dto) {
            return;
        }
        //  entity.id=dto.id;
        entity.id = dto?.id;
        entity.vendorId = dto.vendorId;
        entity.fullName = dto.fullName;
        entity.nationality = dto.Nationality;
        entity.share = dto.Share;

        console.log(entity);
        return entity;
    }

    /**
     * Transfer list of DTO object to Entity  list
     *
     */
    static fromDtos(
        createShareholdersDto: CreateShareholdersDto[],
    ): ShareholdersEntity[] {
        return createShareholdersDto?.map((regDto) =>
            CreateShareholdersDto.fromDto(regDto),
        );
    }
}
// export class UpdateShareHoldersDto extends CreateShareholdersDto {
//     @ApiProperty()
//     @IsUUID()
//     id: string;
//     approvedBy: string;
//     approvedDate: Date;

//     static fromDto(dto: UpdateApplicationDto): ApplicationEntity {
//         const entity = new ApplicationEntity();
//         if (!dto) {
//             return;
//         }
//         entity.id = dto.id;
//         entity.serviceId = dto.serviceId;
//         entity.businessArea = dto.businessArea;
//         entity.vendorId = dto.vendorId;
//         entity.status = dto.Status;
//         console.log(entity);
//         return entity;
//     }
// }
/*
RegistrationSettingsResponseDto
*/
// export class ShareholdersResponseDto extends UpdateApplicationDto {
//     static fromEntity(regDto: ApplicationEntity): ApplicationResponseDto {
//         const response = new ApplicationResponseDto();
//         response.id = regDto.id;
//         response.vendorId = regDto.vendorId;
//         response.serviceId = regDto.serviceId;
//         response.businessArea = regDto.businessArea;
//         response.Status = regDto.status;
//         //response.approvedBy = regDto.approvedBy;
//         // response.approvedDate = regDto.approvedDate;
//         response.submissionDate = regDto.submissionDate;
//         return response;
//     }
// }
