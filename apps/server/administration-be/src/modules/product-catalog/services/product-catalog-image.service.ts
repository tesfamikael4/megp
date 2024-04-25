import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ExtraCrudService } from 'src/shared/service/extra-crud.service';
import { ProductCatalogImage } from 'src/entities';
import { MinIOService } from 'src/shared/min-io';

@Injectable()
export class ProductCatalogImageService extends ExtraCrudService<ProductCatalogImage> {
  constructor(
    @InjectRepository(ProductCatalogImage)
    private readonly repositoryProductCatalogImage: Repository<ProductCatalogImage>,
    private readonly minIOService: MinIOService,
  ) {
    super(repositoryProductCatalogImage);
  }

  async download(id: string): Promise<any> {
    const { fileInfo }: any = await this.repositoryProductCatalogImage.findOne({
      where: { id },
      select: { fileInfo: true },
    });
    return this.minIOService.download(fileInfo, null);
  }

  async generatePresignedGetUrl(id: string): Promise<any> {
    const { fileInfo }: any = await this.repositoryProductCatalogImage.findOne({
      where: { id },
      select: { fileInfo: true },
    });
    const presignedUrl =
      await this.minIOService.generatePresignedDownloadUrl(fileInfo);
    return { presignedUrl };
  }

  async upload(user: any, file: any): Promise<any> {
    file.fileInfo.bucketName = '';
    const preSignedUrl = await this.minIOService.generatePresignedUploadUrl(
      file.fileInfo,
    );
    const documentData = {
      fileInfo: preSignedUrl.file,
      procurementRequisitionId: file.procurementRequisitionId,
      title: file.title,
      organizationId: user.organization.id,
      organizationName: user.organization.name,
    };
    const doc = this.repositoryProductCatalogImage.create(documentData);
    await this.repositoryProductCatalogImage.insert(doc);
    return { ...doc, presignedUrl: preSignedUrl.presignedUrl };
  }
}
