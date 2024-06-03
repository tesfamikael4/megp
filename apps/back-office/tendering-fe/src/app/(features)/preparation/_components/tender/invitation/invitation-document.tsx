'use client';
import { Box, LoadingOverlay } from '@mantine/core';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { useLazyGetFilesQuery } from '../../../_api/tender/invitation-document.api';
import { FileViewer } from '@/app/(features)/_components/file-viewer/file-viewer';

export default function InvitationDocument() {
  const [trigger, { data: url, isLoading }] = useLazyGetFilesQuery();
  const { id } = useParams();
  useEffect(() => {
    if (id) {
      trigger(id);
    }
  }, [id, trigger]);

  return (
    <>
      <main className="mt-4" style={{ height: 'calc(100vh - 200px)' }}>
        <Box className="">
          <LoadingOverlay visible={isLoading} />
          <FileViewer
            height={2226}
            width={1653}
            url={url?.presignedDownload ?? ''}
            filename="Invitation"
          />
        </Box>
      </main>
    </>
  );
}
