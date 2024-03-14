import { Injectable } from '@nestjs/common';
import { PDFDocument } from 'pdf-lib';
import { MinIOService } from '../min-io/min-io.service';
import * as DocxMerger from '@scholarcy/docx-merger';
import { createReport } from 'docx-templates';
import * as libre from 'libreoffice-convert';
import { promisify } from 'util';
import * as FormData from 'form-data';
import axios from 'axios';

@Injectable()
export class DocumentManipulatorService {
  constructor(private readonly minIOService: MinIOService) {}

  async mergePdf(pdfBuffers: Buffer[]) {
    try {
      const mergedPdf = await PDFDocument.create();
      for (const pdfBuffer of pdfBuffers) {
        const pdf = await PDFDocument.load(pdfBuffer);

        const copiedPages = await mergedPdf.copyPages(
          pdf,
          pdf.getPageIndices(),
        );
        copiedPages.forEach((page) => {
          mergedPdf.addPage(page);
        });
      }
      const result = await mergedPdf.save(); // Uint8Array

      await this.minIOService.uploadBuffer(
        Buffer.from(result),
        'preBudgetPlanReport.pdf',
        'application/pdf',
      );
    } catch (error) {
      throw error;
    }
  }

  async mergeDocx(docxBuffers: Buffer[]) {
    try {
      const docx = new DocxMerger();

      await docx.initialize({}, [docxBuffers]);

      const buffer = await docx.save('nodebuffer');

      await this.minIOService.uploadBuffer(
        buffer,
        'preBudgetPlanReport.docx',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      );
    } catch (error) {
      throw error;
    }
  }

  async merge() {
    const bdsTemplateRead = await this.minIOService.downloadBuffer({
      filepath: 'bds-template.docx',
      bucketName: 'megp',
    });

    const bdsTemplateBuffer = await this.streamToBuffer(bdsTemplateRead);

    const bdsTemplatePopulatedBuffer = await this.populateTemplate(
      bdsTemplateBuffer,
      {
        public_body: 'procurement of procedure',
      },
    );

    const bdsTemplatePopulatedHtmlBuffer = await this.convertDocument(
      bdsTemplatePopulatedBuffer,
      '.html',
    );

    const bds = bdsTemplatePopulatedHtmlBuffer.toString();

    const testRead = await this.minIOService.downloadBuffer({
      filepath: 'test.docx',
      bucketName: 'megp',
    });

    const testBuffer = await this.streamToBuffer(testRead);

    const testPopulatedBuffer = await this.populateTemplate(testBuffer, {
      subject_of_procurement: 'procurement of procedure',
      procurement_reference_no: 'procurement of procedure',
      project_name: 'procurement of procedure',
      public_body: 'procurement of procedure',
      date_of_issue_of_bidding: new Date(),
      bds: `${bds}`,
    });

    const pdfBuffer = await this.convertDocxToPdf(testPopulatedBuffer);

    await this.minIOService.uploadBuffer(
      pdfBuffer,
      'report.pdf',
      'application/pdf',
    );

    await this.minIOService.uploadBuffer(
      testPopulatedBuffer,
      'report.docx',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    );
  }

  async convertDocument(inputBuffer: Buffer, fileType: string) {
    const libreConverterAsync = promisify(libre.convert);
    const convertedBuffer = await libreConverterAsync(
      inputBuffer,
      fileType,
      undefined,
    );

    return convertedBuffer;
  }

  async streamToBuffer(readableStream: any): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks = [];
      readableStream.on('data', (chunk: any) => chunks.push(chunk));
      readableStream.on('end', () => resolve(Buffer.concat(chunks)));
      readableStream.on('error', reject);
    });
  }

  async populateTemplate(template: Buffer, data: any) {
    const buffer = await createReport({
      template,
      data,
    });
    return Buffer.from(buffer);
  }

  async convertDocxToPdf(file: Buffer): Promise<Buffer> {
    try {
      const DOCUMENT_CONVERT_ENDPOINT =
        process.env.DOCUMENT_CONVERT_ENDPOINT ?? 'http://196.189.44.48:3000/';
      const form = new FormData();

      form.append('file', file, 'inputFile.docx');

      const request = await axios.post(DOCUMENT_CONVERT_ENDPOINT, form, {
        responseType: 'arraybuffer',
      });

      const outputBuffer = request.data;
      return outputBuffer;
    } catch (error) {
      throw error;
    }
  }
}
