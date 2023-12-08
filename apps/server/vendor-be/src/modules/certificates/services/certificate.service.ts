import { Injectable } from '@nestjs/common';
import { createReadStream, createWriteStream, mkdirSync } from 'fs';
import { Readable } from 'stream';
import { toDataURL } from 'qrcode';
import * as path from 'path';
import Certificate from 'src/modules/certificates/templates/vendor-certificate';
import { VendorRegistrationsService } from 'src/modules/vendor-registration/services/vendor-registration.service';
import { ServicePricingService } from 'src/modules/pricing/services/service-pricing.service';
import { ServicePrice } from 'src/entities';

@Injectable()
export class CertificateService {
  constructor(private readonly vendorService: VendorRegistrationsService,
    private readonly pricingService: ServicePricingService) {

  }
  formatNumber(priceRange: ServicePrice) {
    let valueTo = '';
    let valueFrom = '';
    const curruncy = priceRange.currency;
    if (priceRange.valueFrom >= 1000000000) {
      valueFrom = (priceRange.valueFrom / 1000000000).toFixed(1);
      if (priceRange.valueTo >= 1000000000) {
        valueTo = (priceRange.valueTo / 1000000000).toFixed(1);
        valueTo = '-' + curruncy + valueTo + 'billion'
      }
      return 'Above ' + curruncy + valueFrom + 'billion ' + valueTo;
    }
    else if (priceRange.valueFrom >= 1000000) {
      if (priceRange.valueTo >= 1000000) {
        valueTo = (priceRange.valueTo / 1000000).toFixed(1);
        valueTo = '-' + curruncy + valueTo + 'million'
      }
      const valueFrom = (priceRange.valueFrom / 1000000).toFixed(1);
      return 'Above ' + curruncy + valueFrom + 'million ' + valueTo;
    } else if (priceRange.valueFrom >= 1) {
      valueTo = (priceRange.valueTo / 1000000).toFixed(1);
      valueTo = curruncy + valueTo + 'million'
      return 'Up to ' + curruncy + valueTo;
    }
    return priceRange.valueFrom.toString();
  }

  async generateCertificate(vendorId: string): Promise<Readable> {
    try {
      const fileName = `${vendorId}-certificate.pdf`;
      const dirPath = path.join('src/', 'modules', 'certificates', 'gen-certificates');
      mkdirSync(dirPath, { recursive: true });
      const filePath = path.join(dirPath, fileName);
      const writeStream = createWriteStream(filePath);
      const qrUrl = await toDataURL("I am just testing it", { margin: 0 }) ?? ""
      const vendorInfo = await this.vendorService.getVendorByIdForCertificate(vendorId);
      const address: any = JSON.parse(JSON.stringify(vendorInfo.metaData));
      let goodsCategory = '', serviceCategory = ''
      const areaOfBusinessInterests = vendorInfo.areasOfBusinessInterest;
      for (let i = 0; i < areaOfBusinessInterests.length; i++) {
        const ba = areaOfBusinessInterests[i];
        const range = await this.pricingService.findOne(ba.priceRange);
        const formatedCategory = this.formatNumber(range);
        if (ba.category.toLowerCase() == 'goods') {
          goodsCategory = formatedCategory;

        } else if (ba.category.toLowerCase() == 'services') {
          serviceCategory = formatedCategory;
        }
      }
      let goodsExpiry = '', serviceExpiry = '', expireDate = '';

      const businessAreas = vendorInfo.isrVendor.businessAreas;
      for (let index = 0; index < businessAreas.length; index++) {
        const bArea = businessAreas[index];
        if (bArea.category.toLowerCase() == 'goods') {
          goodsExpiry = bArea.expireDate.toLocaleDateString();
        } else if (bArea.category.toLowerCase() == 'services') {
          serviceExpiry = bArea.expireDate.toLocaleDateString();
        }
      }
      if (goodsExpiry == serviceExpiry) {
        expireDate = goodsExpiry;
      } else {
        expireDate = goodsExpiry + '(Goods),' + serviceExpiry + '(Services)'
      }
      const result = await Certificate({
        id: "",
        data: [
          { label: 'Supplier Code', value: vendorInfo.tin },
          { label: 'Supplier Name', value: vendorInfo.name },
          { label: 'Postal Address', value: address.address.postalAddress },
          { label: 'Supplier Location', value: vendorInfo.district },
          { label: 'Website', value: address.address.website },
          { label: 'Country of Establishment', value: vendorInfo.country, },
          { label: 'Goods Category', value: goodsCategory, },
          { label: 'Services Category', value: serviceCategory, },
          { label: 'Expire Date', value: expireDate },
        ],
        qrCodeUrl: qrUrl,
      });

      if (!(result instanceof Readable)) {
        throw new Error('Certificate function did not return a Readable stream');
      }
      result.pipe(writeStream);
      await new Promise<void>((resolve, reject) => {
        writeStream.on('finish', resolve);
        writeStream.on('error', reject);
      });
      const fileStream = createReadStream(filePath);
      return fileStream;
    } catch (err) {
      console.error('Error:', err);
      throw new Error('Internal Server Error');
    }
  }

}
