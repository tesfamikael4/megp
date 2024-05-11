import { Injectable } from '@nestjs/common';
import { rfxPdf } from '../rfx-review.template';

@Injectable()
export class PdfGeneratorService {
  async pdfGenerator(data: object, type: string) {
    let result;
    const functionMap = {
      rfx: rfxPdf,
    };

    if (functionMap.hasOwnProperty(type)) {
      result = await functionMap[type]({ rfx: data });
    }

    return result;
  }
}
