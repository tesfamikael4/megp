import { ApiProperty } from '@nestjs/swagger';

export class BudgetCodeDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  endDate: Date;
  @ApiProperty()
  startDate: Date;

  constructor(name: string, startDate: Date, endDate: Date) {
    this.name = name;
    this.startDate = startDate;
    this.endDate = endDate;
  }
}
