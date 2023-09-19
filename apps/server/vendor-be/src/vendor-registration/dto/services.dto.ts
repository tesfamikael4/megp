import { ServicesEntity } from '../entities/services.entity';
export class ServicesResponseDto {
  id: string;
  description: string;
  isActive: boolean;
  static fromEntity(dto: ServicesEntity): ServicesResponseDto {
    const response = new ServicesResponseDto();
    response.id = dto.id;
    response.description = dto.description;
    response.isActive = dto.isActive;
    return response;
  }
}
