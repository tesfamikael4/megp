'use client';
import { Box, LoadingOverlay } from '@mantine/core';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { FileViewer } from '@/app/(features)/_components/file-viewer';
import { useLazyGetFilesQuery } from '../../../_api/bid-document.api';

export default function Document() {
  const { id } = useParams();
  const [trigger, { data: url, isLoading }] = useLazyGetFilesQuery();
  useEffect(() => {
    trigger(id);
  }, [id]);
  return (
    <>
      <LoadingOverlay visible={isLoading} />
      <Box className="m-4 bg-white">
        <FileViewer url={url?.presignedDownload} filename="Bid Document" />
      </Box>
    </>
  );
}
