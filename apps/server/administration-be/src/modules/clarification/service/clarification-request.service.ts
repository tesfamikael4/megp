import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClarificationRequest } from 'src/entities/clarification-request.entity';
import { ExtraCrudService } from 'src/shared/service';
import { Repository } from 'typeorm';
import { CreateClarificationRequestDTO } from '../dto/clarification-request.dto';
import { MinIOService } from 'src/shared/min-io/min-io.service';

@Injectable()
export class ClarificationRequestService extends ExtraCrudService<ClarificationRequest> {
  constructor(
    @InjectRepository(ClarificationRequest)
    private readonly repositoryClarificationRequest: Repository<ClarificationRequest>,
    private readonly minIOService: MinIOService,
  ) {
    super(repositoryClarificationRequest);
  }

  async create(
    itemData: CreateClarificationRequestDTO,
    req?: any,
  ): Promise<any> {
    const item = this.repositoryClarificationRequest.create(itemData);

    let preSignedUrl: any;

    if (item?.fileInfo && item.fileInfo?.originalName) {
      preSignedUrl = await this.minIOService.generatePresignedUploadUrl({
        ...itemData.fileInfo,
        bucketName: 'megp',
      });
      item.fileInfo = preSignedUrl.file;
    }

    await this.repositoryClarificationRequest.insert(item);
    return { ...item, preSignedUrl: preSignedUrl?.presignedUrl };
  }

  async getDocumentsPresignedUrl(id: string) {
    const clarificationRequest =
      await this.repositoryClarificationRequest.findOne({
        where: { id },
      });

    if (!clarificationRequest)
      throw new NotFoundException('no_request_with_this_id');

    if (!clarificationRequest.fileInfo)
      throw new NotFoundException('no_file_uploaded');

    const preSignedUrl = await this.minIOService.generatePresignedDownloadUrl(
      clarificationRequest.fileInfo,
    );
    return { preSignedUrl };
  }
}
