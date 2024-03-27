import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GuaranteeForfeit } from 'src/entities/guarantee-forfeit.entity';
import { MinIOService } from 'src/shared/min-io/min-io.service';
import { ExtraCrudService } from 'src/shared/service';
import { Repository } from 'typeorm';
import { CreateGuaranteeForfeitDto } from '../dtos/guarantee-forfeit.dto';

@Injectable()
export class GuaranteeForfeitService extends ExtraCrudService<GuaranteeForfeit> {
  constructor(
    @InjectRepository(GuaranteeForfeit)
    private readonly forfeitRepository: Repository<GuaranteeForfeit>,
    private readonly minIOService: MinIOService,
  ) {
    super(forfeitRepository);
  }

  async create(forfeitData: CreateGuaranteeForfeitDto): Promise<any> {
    const forfeit = this.forfeitRepository.create(forfeitData);
    let preSignedUrl: any;
    if (forfeit?.attachment && forfeit.attachment?.originalName) {
      preSignedUrl = await this.minIOService.generatePresignedUploadUrl({
        ...forfeitData.attachment,
        bucketName: 'megp',
      });
      forfeit.attachment = preSignedUrl.file;
    }
    await this.forfeitRepository.insert(forfeit);
    return { ...forfeit, preSignedUrl: preSignedUrl?.presignedUrl };
  }

  async getDocumentsPresignedUrl(id: string) {
    const forfeit = await this.forfeitRepository.findOne({
      where: { id },
    });

    if (!forfeit) {
      throw new NotFoundException('Forfeit not found');
    }

    if (!forfeit.attachment) {
      throw new NotFoundException('No file uploaded');
    }

    const preSignedUrl = await this.minIOService.generatePresignedDownloadUrl(
      forfeit.attachment,
    );
    return preSignedUrl;
  }
}
