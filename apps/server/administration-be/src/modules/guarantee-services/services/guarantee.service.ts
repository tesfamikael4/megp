import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EntityCrudService } from 'src/shared/service';
import { Guarantee } from 'src/entities/guarantee.entity';
import { UpdateGuaranteeStatusDto } from '../dtos/update-guarantee-status.dto';
import { CreateGuaranteeDto } from '../dtos/guarantee.dto';
import { MinIOService } from 'src/shared/min-io/min-io.service';
@Injectable()
export class GuaranteeService extends EntityCrudService<Guarantee> {
  constructor(
    @InjectRepository(Guarantee)
    private readonly guaranteeRepository: Repository<Guarantee>,
    private readonly minIOService: MinIOService,
  ) {
    super(guaranteeRepository);
  }

  async updateStatus(
    id: string,
    updateGuaranteeStatusDto: UpdateGuaranteeStatusDto,
  ): Promise<Guarantee> {
    const guarantee = await this.findOne(id);
    if (!guarantee) {
      throw new NotFoundException('Guarantee not found');
    }
    return await super.update(id, updateGuaranteeStatusDto);
  }

  async create(guaranteeData: CreateGuaranteeDto): Promise<any> {
    const guarantee = this.guaranteeRepository.create(guaranteeData);

    let preSignedUrl: any;
    if (guarantee?.attachment && guarantee.attachment?.originalName) {
      preSignedUrl = await this.minIOService.generatePresignedUploadUrl({
        ...guaranteeData.attachment,
        bucketName: 'megp',
      });
      guarantee.attachment = preSignedUrl.file;
    }

    await this.guaranteeRepository.insert(guarantee);
    return { ...guarantee, preSignedUrl: preSignedUrl?.presignedUrl };
  }

  async getDocumentsPresignedUrl(id: string) {
    const guarantee = await this.guaranteeRepository.findOne({
      where: { id },
    });

    if (!guarantee) {
      throw new NotFoundException('Guarantee not found');
    }

    if (!guarantee.attachment) {
      throw new NotFoundException('No file uploaded');
    }

    const preSignedUrl = await this.minIOService.generatePresignedDownloadUrl(
      guarantee.attachment,
    );

    return preSignedUrl;
  }
}
