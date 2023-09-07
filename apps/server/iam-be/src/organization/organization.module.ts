import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationController } from './organization.controller';
import { Organization } from './entities/organization.entity';
import { OrganizationService } from './organization.service';
import { Unit } from './entities/unit.entity';
import { Employee } from './entities/employee.entity';
import { Office } from './entities/office.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Organization, Unit, Employee, Office])],
  providers: [OrganizationService],
  controllers: [OrganizationController],
  exports: [OrganizationService],
})
export class OrganizationModule {}
