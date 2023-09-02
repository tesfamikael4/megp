import { Organization } from '../entities/organization.entity';
export declare class CreateOrganizationDto {
  name: string;
  code: string;
  type: string;
  static fromDto(organizationDto: CreateOrganizationDto): Organization;
  static fromDtos(organizationDto: CreateOrganizationDto[]): Organization[];
}
export declare class UpdateOrganizationDto extends CreateOrganizationDto {
  id: string;
  static fromDto(organizationDto: UpdateOrganizationDto): Organization;
}
export declare class OrganizationResponseDto extends UpdateOrganizationDto {
  static toDto(organization: Organization): OrganizationResponseDto;
  static toDtos(organizations: Organization[]): OrganizationResponseDto[];
}
