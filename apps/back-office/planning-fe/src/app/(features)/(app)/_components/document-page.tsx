'use client';
import { useParams } from 'next/navigation';
import PlanningTab from './planning-tab';
import { useLazyGetApprovalDocumentDetailByIdQuery } from '@/store/api/pre-budget-plan/pre-budget-plan.api';
import { useEffect, useState } from 'react';
import { PDFHighlighter } from '../../_components/pdf-highlighter';
import { logger } from '@megp/core-fe';

export const DocumentPage = ({ page }: { page: 'pre' | 'post' }) => {
  const { documentId } = useParams();
  const [getDocument, { data }] = useLazyGetApprovalDocumentDetailByIdQuery();
  const [fileUrl, setFileUrl] = useState<string>('');

  useEffect(() => {
    const getFile = async () => {
      fetch(data.presignedUrl)
        .then((response) => response.blob())
        .then((blob) => {
          const objectURL = URL.createObjectURL(blob);
          setFileUrl(objectURL);
        })
        .catch((error) => {
          logger.error('Error fetching PDF:', error);
        });
    };
    if (data) getFile();
  }, [data]);

  useEffect(() => {
    getDocument(documentId as string);
  }, [documentId]);
  return (
    <>
      <PlanningTab page={page} />
      <PDFHighlighter
        objectId={documentId as string}
        pdfUrl={fileUrl}
        title={data?.document.fileInfo.originalname}
      />
    </>
  );
};
