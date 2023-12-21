import { Injectable, NotFoundException } from '@nestjs/common';
import { createReadStream, createWriteStream, mkdirSync } from 'fs';
import { Readable } from 'stream';
import { toDataURL } from 'qrcode';
import * as path from 'path';
import Certificate from 'src/modules/certificates/templates/vendor-certificate';
import { VendorRegistrationsService } from 'src/modules/vendor-registration/services/vendor-registration.service';
import { ServicePrice } from 'src/entities';
import { WorkflowService } from 'src/modules/bpm/services/workflow.service';
import { GotoNextStateDto } from 'src/modules/handling/dto/workflow-instance.dto';
import { WorkflowInstanceEnum } from 'src/modules/handling/dto/workflow-instance.enum';
import { FileService } from 'src/modules/vendor-registration/services/file.service';

@Injectable()
export class CertificateService {
  constructor(
    private readonly vendorService: VendorRegistrationsService,
    private readonly wfService: WorkflowService,
    private readonly fileService: FileService,
  ) { }
  formatNumber(priceRange: ServicePrice) {
    let valueTo = '';
    let valueFrom = '';
    const curruncy = priceRange.currency; //currency
    if (priceRange.valueFrom >= 1000000000) {
      valueFrom = (priceRange.valueFrom / 1000000000).toFixed(0);
      if (priceRange.valueTo >= 1000000000) {
        valueTo = (priceRange.valueTo / 1000000000).toFixed(0);
        valueTo = ' - ' + curruncy + valueTo + ' billion';
      }
      return 'Above ' + curruncy + valueFrom + ' billion ' + valueTo;
    } else if (priceRange.valueFrom >= 1000000) {
      if (priceRange.valueTo >= 1000000000) {
        valueTo = (priceRange.valueTo / 1000000000).toFixed(0);
        valueTo = ' - ' + curruncy + valueTo + ' billion';
      } else if (priceRange.valueTo >= 1000000) {
        valueTo = (priceRange.valueTo / 1000000).toFixed(0);
        valueTo = ' - ' + curruncy + valueTo + ' million';
      }
      const valueFrom = (priceRange.valueFrom / 1000000).toFixed(0);
      return 'Above ' + curruncy + valueFrom + ' million ' + valueTo;
    } else if (priceRange.valueFrom >= 1) {
      valueTo = (priceRange.valueTo / 1000000).toFixed(0);
      valueTo = curruncy + valueTo + ' million';
      return 'Up to ' + curruncy + valueTo;
    }
    return priceRange.valueFrom.toString();
  }

  async generateCertificate(
    vendorId: string,
    instanceId: string,
    user: any,
  ): Promise<Readable> {
    try {
      let buffer: Buffer;

      // const fileName = `${vendorId}-certificate.pdf`;
      // const dirPath = path.join(
      //   process.cwd(),
      //   'modules',
      //   'certificates',
      //   'gen-certificates',
      // );
      // mkdirSync(dirPath, { recursive: true });
      // const filePath = path.join(dirPath, fileName);
      // const writeStream = createWriteStream(filePath);

      const qrUrl =
        (await toDataURL('https://dev.megp.peragosystems.com/', {
          margin: 0,
        })) ?? '';
      const app = await this.wfService.getInstance(instanceId);
      if (app.status != WorkflowInstanceEnum.Completed) {
        const command = new GotoNextStateDto();
        command.instanceId = instanceId;
        command.action = 'SUCCESS';
        await this.wfService.gotoNextStep(command, user);
      }
      const vendorInfo =
        await this.vendorService.getVendorByIdForCertificate(vendorId);
      if (!vendorInfo) throw new NotFoundException();
      const address = vendorInfo.metaData; // JSON.parse(JSON.stringify();
      let goodsCategory = '',
        serviceCategory = '';
      let goodsExpiry = '',
        serviceExpiry = '',
        expireDate = '';
      let businessAreaId = '';
      const bas = vendorInfo.isrVendor.businessAreas;
      bas.map((bArea) => {
        const range = bArea.servicePrice;
        businessAreaId = bArea.id;
        const formatedCategory = this.formatNumber(range);
        if (bArea.category.toLowerCase() == 'goods') {
          goodsCategory = formatedCategory;
          goodsExpiry = bArea.expireDate.toLocaleDateString();
        } else if (bArea.category.toLowerCase() == 'services') {
          serviceCategory = formatedCategory;
          serviceExpiry = bArea.expireDate.toLocaleDateString();
        }
      });
      expireDate = this.formatExpireDates(goodsExpiry, serviceExpiry);
      const result = await Certificate({
        id: '',
        data: [
          { label: 'Supplier Code', value: vendorInfo.tin },
          { label: 'Supplier Name', value: vendorInfo.name },
          { label: 'Postal Address', value: address.address.postalAddress },
          { label: 'Supplier Location', value: vendorInfo.district },
          { label: 'Website', value: address.address.website },
          { label: 'Country of Establishment', value: vendorInfo.country },
          { label: 'Goods Category', value: goodsCategory },
          { label: 'Services Category', value: serviceCategory },
          { label: 'Expire Date', value: expireDate },
        ],
        qrCodeUrl: qrUrl,
      });

      const chunks = [];
      result.on('data', (chunk) => {
        chunks.push(chunk);
      });

      result.on('end', () => {
        buffer = Buffer.concat(chunks);
        this.fileService.uploadCertificate2(buffer, vendorId, businessAreaId);
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

  formatExpireDates(goodsExpiry: string, serviceExpiry: string) {
    if (goodsExpiry == serviceExpiry) {
      return goodsExpiry;
    } else {
      let gc = '',
        sc = '';
      if (goodsExpiry != '') {
        gc = '(Goods), ';
      }
      if (serviceExpiry != '') {
        sc = '(Services)';
      }
      if (goodsExpiry == '' || serviceExpiry == '') {
        gc = '';
        sc = '';
      }
      return goodsExpiry + `${gc}` + serviceExpiry + `${sc}`;
    }
  }
}
