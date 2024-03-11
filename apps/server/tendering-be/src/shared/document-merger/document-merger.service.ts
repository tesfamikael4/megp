import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { PDFDocument } from 'pdf-lib';
import * as fs from 'fs';
import { MinIOService } from '../min-io/min-io.service';
import * as DocxMerger from '@scholarcy/docx-merger';
import { createReport } from 'docx-templates';
import * as libre from 'libreoffice-convert';
import { promisify } from 'util';
import { PythonShell } from 'python-shell';

@Injectable()
export class DocumentMergerService {
  constructor(private readonly minIOService: MinIOService) {}
  async mergePdf() {
    try {
      const basePath = process.cwd();
      const file1 = join(basePath, '1.pdf');
      const file2 = join(basePath, '2.pdf');
      const file3 = join(basePath, '4.pdf');

      const mergedPdf = await PDFDocument.create();
      const pdfBuffer1 = fs.readFileSync(file1);
      const pdfBuffer2 = fs.readFileSync(file2);
      const pdfsToMerge = [pdfBuffer1, pdfBuffer2];
      for (const pdfBytes of pdfsToMerge) {
        const pdf = await PDFDocument.load(pdfBytes);

        const copiedPages = await mergedPdf.copyPages(
          pdf,
          pdf.getPageIndices(),
        );
        copiedPages.forEach((page) => {
          mergedPdf.addPage(page);
        });
      }
      const buf = await mergedPdf.save(); // Uint8Array

      await this.minIOService.uploadBuffer(
        Buffer.from(buf),
        'preBudgetPlanReport.pdf',
        'application/pdf',
      );
    } catch (error) {
      throw error;
    }
  }

  async mergeDocx() {
    try {
      const basePath = process.cwd();
      const file1 = join(basePath, '1.docx');
      const file2 = join(basePath, '3.docx');
      const file3 = join(basePath, '4.docx');

      const pdfBuffer1 = fs.readFileSync(file1);
      const pdfBuffer2 = fs.readFileSync(file2);
      const docx = new DocxMerger();

      await docx.initialize({}, [pdfBuffer1, pdfBuffer2]);

      const buf = await docx.save('nodebuffer');

      await this.minIOService.uploadBuffer(
        String(Date.now()),
        buf,
        'preBudgetPlanReport.docx',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      );
    } catch (error) {
      throw error;
    }
  }

  async merge() {
    const libreConverterAsync = promisify(libre.convert);

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

    const bdsTemplatePopulatedHtmlBuffer = await libreConverterAsync(
      bdsTemplatePopulatedBuffer,
      '.html',
      undefined,
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

    await this.minIOService.uploadBuffer(
      testPopulatedBuffer,
      'report.docx',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    );

    await fs.writeFileSync('bidding_document.docx', testPopulatedBuffer);
    await this.convertDocxToPdf(
      'bidding_document.docx',
      'bidding_document.pdf',
    );

    const pdfBuffer = await fs.readFileSync('bidding_document.pdf');

    // const pdfBuffer = await libreConverterAsync(
    //   testPopulatedBuffer,
    //   '.pdf',
    //   undefined,
    // );

    // await fs.writeFileSync('temp.pdf', pdfBuffer);

    await this.minIOService.uploadBuffer(
      pdfBuffer,
      'report.pdf',
      'application/pdf',
    );
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

  async convertDocxToPdf(inputFile, outputFile): Promise<void> {
    // let outputPath = join(process.cwd(), 'src', 'temp.pdf');

    // if (process.env.NODE_ENV === 'production') {
    //   outputPath = join(
    //     process.cwd(),
    //     'apps',
    //     'server',
    //     'tendering-be',
    //     'dist',
    //     'temp.pdf',
    //   );
    // }

    const pythonCode = `from docx2pdf import convert
convert("${inputFile}", "${outputFile}")`;

    await PythonShell.runString(pythonCode, null);
  }
}
