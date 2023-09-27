import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { DataResponseFormat } from '../../shared/api-data';
import { v4 as uuidv4 } from 'uuid';
import {
  CollectionQuery,
  QueryConstructor,
} from '../../shared/collection-query';
import {
  CreateMandateDto,
  MandateResponseDto,
  UpdateMandateDto,
} from '../dto/mandate.dto';
import { Mandate } from '../entities/mandate.entity';
import { OrganizationMandate } from '../entities/organization-mandate.entity';
import {
  CreateMandatePermissionDto,
  UpdateMandatePermissionDto,
} from '../dto/mandate-permission.dto';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
@Injectable()
export class MandateService {
  constructor(
    @InjectRepository(Mandate)
    private readonly repository: Repository<Mandate>,
    private dataSource: DataSource,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(mandate: CreateMandateDto): Promise<MandateResponseDto> {
    const mandateEntity = CreateMandateDto.fromDto(mandate);
    await this.repository.save(mandateEntity);

    return MandateResponseDto.toDto(mandateEntity);
  }

  async update(
    id: string,
    mandate: UpdateMandateDto,
  ): Promise<MandateResponseDto> {
    mandate.id = id;
    const mandateEntity = UpdateMandateDto.fromDto(mandate);
    await this.repository.update({ id: mandate.id }, mandateEntity);
    return MandateResponseDto.toDto(mandateEntity);
  }

  async findAll(query: CollectionQuery) {
    const dataQuery = QueryConstructor.constructQuery<Mandate>(
      this.repository,
      query,
    );
    const response = new DataResponseFormat<MandateResponseDto>();
    if (query.count) {
      response.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      response.total = total;
      response.items = MandateResponseDto.toDtos(result);
    }
    return response;
  }
  async fetchMandatesToAssign(
    organizationId: string,
    query: CollectionQuery,
  ): Promise<DataResponseFormat<MandateResponseDto>> {
    const assignedMandates = await this.dataSource
      .createQueryBuilder()
      .select('organizationMandates')
      .from(OrganizationMandate, 'organizationMandates')
      .where('organizationMandates.isSingleAssignment =:isSingleAssignment', {
        isSingleAssignment: true,
      })
      .andWhere('organizationMandates.organizationId !=:organizationId', {
        organizationId: organizationId,
      })
      .getMany();
    const a: any = [];
    assignedMandates.map((element) => {
      a.push(element.mandateId);
    });
    const dataQuery = this.repository.createQueryBuilder('mandates');
    dataQuery.innerJoin('mandates.mandatePermissions', 'mandatePermissions'); // it should have at least one mandate permission to assign
    if (a.length > 0) {
      dataQuery.andWhere('mandates.id NOT IN (:...ids)', { ids: a });
    }
    const d = new DataResponseFormat<MandateResponseDto>();
    if (query.count) {
      d.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      d.items = result.map((entity) => MandateResponseDto.toDto(entity));
      d.total = total;
    }
    return d;
  }
  async findOne(
    id: string,
    relations: any,
    withDeleted = false,
  ): Promise<MandateResponseDto> {
    console.log(relations);
    const mandateEntity = await this.repository.findOne({
      where: { id },
      relations: relations.includes,
      withDeleted: withDeleted,
    });
    return MandateResponseDto.toDto(mandateEntity);
  }

  async remove(id: string): Promise<void> {
    await this.repository.delete({ id: id });
  }
  async assignPermissions(
    id: string,
    mandatePermission: UpdateMandatePermissionDto[],
  ): Promise<MandateResponseDto> {
    let result: Mandate = new Mandate();
    const mandateEntity = await await this.repository.findOne({
      where: { id: id },
      relations: ['organizationMandates', 'mandatePermissions'],
    });
    mandatePermission.map((element) => {
      element.id = uuidv4();
    });
    const mandatePermissions =
      CreateMandatePermissionDto.fromDtos(mandatePermission);
    mandateEntity.mandatePermissions = mandatePermissions;
    result = await this.repository.save(mandateEntity);

    return MandateResponseDto.toDto(result);
  }

  @OnEvent('mandate-permissions.created')
  async assignPermissionsEvent(event: any): Promise<MandateResponseDto> {
    let result: Mandate = new Mandate();
    const mandatePermission = event.mandatePermissionsEvent;
    const id = mandatePermission[0].mandateId;
    const mandateEntity1 = await this.repository.find({
      where: { id },
      relations: ['organizationMandates', 'mandatePermissions'],
    });
    const mandateEntity = mandateEntity1[0];
    mandateEntity.mandatePermissions = mandatePermission;
    result = await this.repository.save(mandateEntity);
    return MandateResponseDto.toDto(result);
  }
}
