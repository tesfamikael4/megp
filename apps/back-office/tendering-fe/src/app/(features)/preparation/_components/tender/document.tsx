import { Box, LoadingOverlay } from '@mantine/core';
import { PDFHighlighter } from '@/app/(features)/_components/pdf-highlighter';
import { useLazyGetFilesQuery } from '@/app/(features)/revision/_api/bid-document.api';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';

export default function Document() {
  const { id } = useParams();
  const [trigger, { data: url, isLoading }] = useLazyGetFilesQuery();
  useEffect(() => {
    trigger(id);
  }, [id]);
  return (
    <>
      <LoadingOverlay visible={isLoading} />
      <Box className="m-4">
        <PDFHighlighter
          objectId={id as string}
          pdfUrl={url?.presignedDownload}
          title="Bid Document"
        />
      </Box>
    </>
  );
}
