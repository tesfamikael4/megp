import { ApiProperty } from '@nestjs/swagger';
import { WorkflowInstanceEntity } from 'src/entities/workflow-instance.entity';
export class ActiveVendorsResponse {
  id: string;
  @ApiProperty()
  tin: string;
  @ApiProperty()
  userId: string;
  @ApiProperty()
  status: string;
  @ApiProperty()
  formOfEntity: string;
  @ApiProperty()
  country: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  district: string;
  @ApiProperty()
  origin: string;
  @ApiProperty()
  businessCategory: string;
  @ApiProperty()
  level: string;
  @ApiProperty()
  approvedOn: Date;
  @ApiProperty()
  expiryDate: Date;
  @ApiProperty()
  businessStatus: string;
  @ApiProperty()
  vendorId: string;
}
