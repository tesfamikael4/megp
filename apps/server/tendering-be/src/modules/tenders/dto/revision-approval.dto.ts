import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateRevisionApprovalDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  tenderId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  status: string;
}

export class UpdateRevisionApprovalDto extends CreateRevisionApprovalDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}

export class RevisionApprovalResponseDto extends UpdateRevisionApprovalDto {}
