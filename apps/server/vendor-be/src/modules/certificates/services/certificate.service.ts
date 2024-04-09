import { Injectable, NotFoundException } from '@nestjs/common';
import { Readable } from 'stream';
import { toDataURL } from 'qrcode';
import { VendorRegistrationsService } from 'src/modules/vendor-registration/services/vendor-registration.service';
import { WorkflowService } from 'src/modules/bpm/services/workflow.service';
import { GotoNextStateDto } from 'src/modules/handling/dto/workflow-instance.dto';
import { FileService } from 'src/modules/vendor-registration/services/file.service';
import { ApplicationStatus } from 'src/modules/handling/enums/application-status.enum';
import RegistrationCertificate from '../templates/certificate';
import { HandlingCommonService } from 'src/modules/handling/services/handling-common-services';
import { BusinessAreaService } from 'src/modules/vendor-registration/services/business-area.service';

@Injectable()
export class CertificateService {
  constructor(
    private readonly vendorService: VendorRegistrationsService,
    private readonly wfService: WorkflowService,
    private readonly fileService: FileService,
    private readonly commonService: HandlingCommonService,
    private readonly baService: BusinessAreaService
  ) { }

  async generateCertificate(
    vendorId: string,
    instanceId: string,
    user: any,
  ): Promise<Readable> {
    try {
      let buffer: Buffer;
      const chunks = [];
      const qrUrl =
        (await toDataURL('https://dev.megp.peragosystems.com/', {
          margin: 0,
        })) ?? '';
      const app = await this.wfService.getInstance(instanceId);
      const userId = app?.userId;
      if (app?.status != ApplicationStatus.COMPLETED) {
        const command = new GotoNextStateDto();
        command.instanceId = instanceId;
        command.action = 'SUCCESS';
        await this.wfService.gotoNextStep(command, user);
      }

      // vendor basic informations
      const vendorInfo =
        await this.vendorService.getVendorByIdForCertificate(vendorId);
      if (!vendorInfo) throw new NotFoundException();
      //registered business classes
      const bussinessAreas = this.baService.getVendorServicesWithPrice(vendorInfo.id)
      const bcs = (await bussinessAreas).map((item) => {
        return {
          Category: item.category,
          PriceRange: this.commonService.formatPriceRange(item.servicePrice),
          IssueDate: item.approvedAt.toLocaleDateString(),
          ExpiryDate: item.expireDate.toLocaleDateString(),
        }
      })
      //registered Preferential treatments
      const pts = await this.baService.getVendorPreferentials(vendorInfo.id);
      const preferentials = pts.map((item) => {
        return {
          Category: item.BpService.name,
          IssueDate: item.approvedAt.toLocaleDateString(),
          ExpiryDate: item.expireDate.toLocaleDateString(),
        }
      })

      const basic = [
        {
          label: 'eGP Registration No',
          value: vendorInfo?.registrationNumber,
        },
        {
          label: 'Tax Identification No',
          value: vendorInfo.tin,
        },
        {
          label: 'Vendor Name',
          value: vendorInfo.name,
        },
        {
          label: 'Country of Registration',
          value: vendorInfo.origin,
        },
        {
          label: 'Address',
          value: vendorInfo.metaData.address?.primaryEmail,
        },
      ];

      const result = await RegistrationCertificate({ basicInfo: [...basic], businessClass: [...bcs], preferentials: [...preferentials], qrCodeUrl: qrUrl });
      result.on('data', (chunk) => {
        chunks.push(chunk);
      });

      result.on('end', () => {
        buffer = Buffer.concat(chunks);
        this.fileService.uploadCertificate2(buffer, userId, instanceId);
      });
      result.on('error', (error) => {
        console.error('Error during rendering:', error);
      });

      if (!(result instanceof Readable)) {
        throw new Error(
          'Certificate function did not return a Readable stream',
        );
      }
      return result;
    } catch (err) {
      console.error('Error:', err);
      throw new Error('Internal Server Error' + err);
    }
  }

}
