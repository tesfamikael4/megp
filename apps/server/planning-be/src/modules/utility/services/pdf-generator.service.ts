import { Injectable } from '@nestjs/common';
import { postReportPdf } from './report-pre-budget';
import { preReportPdf } from './report-post-budget';

@Injectable()
export class PdfGeneratorService {
  async pdfGenerator(data: object, type: string) {
    let result;
    const functionMap = {
      pre: preReportPdf,
      post: postReportPdf,
    };

    if (functionMap.hasOwnProperty(type)) {
      result = await functionMap[type]({ activities: data });
    }

    return result;
  }
}
