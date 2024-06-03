'use client';

import { PDFHighlighter } from '../../_components/pdf-highlighter';
import { useParams } from 'next/navigation';
import { Box, LoadingOverlay } from '@mantine/core';
import { useEffect, useState } from 'react';
import { logger } from '@megp/core-fe';
import { WorkflowHandling } from '../_components/workflow';
import { useReadQuery } from '../_api/tender/tender.api';
import { useLazyGetFilesQuery } from '../../revision/_api/bid-document.api';

export default function WorkflowPage() {
  const { id } = useParams();
  const [trigger, { data: url, isLoading }] = useLazyGetFilesQuery();
  useEffect(() => {
    trigger(id);
  }, [id]);

  return (
    <Box className="min-h-screen">
      <LoadingOverlay visible={isLoading} />
      {url && (
        <PDFHighlighter
          title="Bid Document"
          objectId={id as string}
          pdfUrl={url?.presignedDownload}
          workflow={
            <WorkflowHandling
              itemId={id as string}
              itemKey={'tenderApproval'}
            />
          }
        />
      )}
    </Box>
  );
}
