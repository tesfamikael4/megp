import { Box, LoadingOverlay } from '@mantine/core';
import { PDFHighlighter } from '@/app/(features)/_components/pdf-highlighter';
import { useLazyGetFilesQuery } from '@/app/(features)/revision/_api/bid-document.api';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { FileViewer } from '../../_components/file-viewer/file-viewer';

export default function Document() {
  const { tenderId } = useParams();
  const [trigger, { data: url, isLoading }] = useLazyGetFilesQuery();
  useEffect(() => {
    trigger(tenderId);
  }, [tenderId]);
  return (
    <>
      <LoadingOverlay visible={isLoading} />
      <Box className="m-4">
        <FileViewer url={url?.presignedDownload} filename="Bid Document" />
      </Box>
    </>
  );
}
