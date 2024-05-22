'use client';

import { PDFHighlighter } from '../../_components/pdf-highlighter';
import { useParams } from 'next/navigation';
import { Button, LoadingOverlay, Stack } from '@mantine/core';
import { useEffect, useState } from 'react';
import { logger } from '@megp/core-fe';
import {
  useGetPreSignedQuery,
  useSubmitForApprovalMutation,
} from '@/store/api/rfx/rfx.api';
import { notifications } from '@mantine/notifications';

export default function WorkflowPage() {
  const { id } = useParams();
  const { data, isLoading: isGettingPresigned } = useGetPreSignedQuery({
    id: id.toString(),
  });
  const [submitForApproval, { isLoading: isSubmitting }] =
    useSubmitForApprovalMutation();
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
          logger.error('Error fetching PDF:', error);
        });
    };
    if (data) getFile();
  }, [data]);

  const handleSubmitForApproval = async () => {
    try {
      await submitForApproval({
        id: id as string,
      }).unwrap();
      notifications.show({
        title: 'Success',
        message: 'Submitted for approval successfully',
        color: 'green',
      });
    } catch (err: any) {
      notifications.show({
        title: 'Error',
        message: err.data.message,
        color: 'red',
      });
    }
  };

  return (
    <Stack className="min-h-screen">
      <LoadingOverlay visible={isGettingPresigned} className="m-auto" />
      <Button
        className="ml-auto"
        loading={isSubmitting}
        onClick={handleSubmitForApproval}
      >
        Submit for approval
      </Button>
      {true && (
        <PDFHighlighter
          title={data?.document.fileInfo.originalname}
          objectId={data?.document.itemId as string}
          pdfUrl={fileUrl}
        />
      )}
    </Stack>
  );
}
