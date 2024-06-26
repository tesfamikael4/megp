import { Injectable } from '@nestjs/common';
import { technicalEndorsementReportPdf } from '../templates/technicalEndorsementReportPdf';

@Injectable()
export class PdfGeneratorService {
  async pdfGenerator(data: object, type: string) {
    let result;
    const functionMap = {
      technicalEndorsement: technicalEndorsementReportPdf,
    };

    if (functionMap.hasOwnProperty(type)) {
      result = await functionMap[type]({ activities: data });
    }

    return result;
  }
}
