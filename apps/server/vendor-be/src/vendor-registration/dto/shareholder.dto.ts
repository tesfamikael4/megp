import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { ShareholdersEntity } from '../entities/shareholder.entity';

export class CreateShareholdersDto {
  id: string;
  @ApiProperty()
  @IsNotEmpty()
  firstName: string;
  @ApiProperty()
  @IsNotEmpty()
  lastName: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  nationality: string; //new renew  Upgrade
  @ApiProperty()
  @IsNotEmpty()
  share: string;

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
    entity.firstName = dto.firstName;
    entity.lastName = dto.lastName;
    entity.nationality = dto.nationality;
    entity.share = dto.share;

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
export class UpdateShareHoldersDto extends CreateShareholdersDto {
  @ApiProperty()
  @IsUUID()
  id: string;
  approvedBy: string;
  approvedDate: Date;

  static fromDto(dto: UpdateShareHoldersDto): ShareholdersEntity {
    const entity = new ShareholdersEntity();
    if (!dto) {
      return;
    }
    entity.id = dto.id;
    entity.vendorId = dto.vendorId;
    entity.firstName = dto.firstName;
    entity.lastName = dto.lastName;
    entity.share = dto.vendorId;
    entity.nationality = dto.nationality;
    console.log(entity);
    return entity;
  }
}
/*
RegistrationSettingsResponseDto
*/
export class ShareholdersResponseDto extends CreateShareholdersDto {
  static fromEntity(regDto: ShareholdersEntity): ShareholdersResponseDto {
    const response = new ShareholdersResponseDto();
    response.id = regDto.id;
    response.vendorId = regDto.vendorId;
    response.nationality = regDto.nationality;
    response.firstName = regDto.firstName;
    response.nationality = regDto.nationality;
    response.share = regDto.share;
    return response;
  }
}
