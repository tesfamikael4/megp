import { logger } from '@megp/core-fe';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export const FileViewer = ({ url }: { url: string; filename: string }) => {
  function onDocumentLoadSuccess({
    numPages: nextNumPages,
  }: {
    numPages: number;
  }) {
    logger.log(nextNumPages);
  }

  const options = {
    cMapUrl: 'cmaps/',
    cMapPacked: true,
    standardFontDataUrl: 'standard_fonts/',
  };

  return (
    <>
      <div
        style={{ height: 'calc(100vh - 64px)' }}
        className="flex items-center"
      >
        <div className="h-full flex justify-center mx-auto">
          <Document
            file={url}
            onLoadSuccess={onDocumentLoadSuccess}
            options={options}
            renderMode="canvas"
            className=""
          >
            <Page
              className=""
              renderAnnotationLayer={false}
              renderTextLayer={false}
            />
          </Document>
        </div>
      </div>
    </>
  );
};
