import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import classes from './file-viewer.module.scss';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export const FileViewer = ({ url }: { url: string; filename: string }) => {
  const [numPages, setNumPages] = useState<number>(0);
  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }
  const options = {
    cMapUrl: 'cmaps/',
    cMapPacked: true,
    standardFontDataUrl: 'standard_fonts/',
  };

  return (
    <>
      <div className="h-screen flex items-center overflow-auto">
        <div className="h-full flex justify-center mx-auto container">
          <Document
            file={url}
            onLoadSuccess={onDocumentLoadSuccess}
            options={options}
          >
            {Array.from(new Array(numPages), (el, index) => (
              <Page
                height={2226}
                width={1653}
                key={`page_${index + 1}`}
                pageNumber={index + 1}
              />
            ))}
          </Document>
        </div>
      </div>
    </>
  );
};
