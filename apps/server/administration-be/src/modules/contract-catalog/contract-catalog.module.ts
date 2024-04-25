import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContractCatalog } from 'src/entities';
import { ContractCatalogsService } from './services/contract-catalog.service';
import { ContractCatalogsController } from './controllers/contract-catalog.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ContractCatalog])],
  controllers: [ContractCatalogsController],
  providers: [ContractCatalogsService],
})
export class ContractCatalogModule {}
