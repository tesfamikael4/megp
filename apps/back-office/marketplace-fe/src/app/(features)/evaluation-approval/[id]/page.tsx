'use client';

import { PDFHighlighter } from '../../_components/pdf-highlighter';
import { useParams } from 'next/navigation';
import { Box, LoadingOverlay } from '@mantine/core';
import { useGetPreSignedQuery } from '@/store/api/rfx/rfx.api';
import { useEffect, useState } from 'react';
import { logger } from '@megp/core-fe';
import { WorkflowHandling } from '../../_components/workflow';

export default function WorkflowPage() {
  const { id } = useParams();
  const { data, isLoading } = useGetPreSignedQuery({ id: id.toString() });
  const [fileUrl, setFileUrl] = useState<string>('');

  useEffect(() => {
    const getFile = async () => {
      fetch(data?.presignedUrl)
        .then((response) => response.blob())
        .then((blob) => {
          const objectURL = URL.createObjectURL(blob);
          setFileUrl(objectURL);
        })
        .catch((error) => {
          logger.error('Error Fetching PDF:', error);
        });
    };
    if (data) getFile();
  }, [data]);

  return (
    <Box className="min-h-screen">
      <LoadingOverlay visible={isLoading} className="m-auto" />
      {true && (
        <PDFHighlighter
          title={data?.document.fileInfo.originalname}
          objectId={data?.document.itemId as string}
          pdfUrl={fileUrl}
          workflow={
            <WorkflowHandling itemId={id as string} itemKey={'rfxApproval'} />
          }
        />
      )}
    </Box>
  );
}
