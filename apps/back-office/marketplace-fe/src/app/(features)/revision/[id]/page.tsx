'use client';

import { PDFHighlighter } from '../../_components/pdf-highlighter';
import { useParams, useRouter } from 'next/navigation';
import { Button, Flex, LoadingOverlay, Stack } from '@mantine/core';
import { useEffect, useState } from 'react';
import { logger } from '@megp/core-fe';
import {
  useGetPreSignedQuery,
  useHandleApprovalMutation,
  useSubmitForApprovalMutation,
} from '@/store/api/rfx/rfx.api';
import { notifications } from '@mantine/notifications';

export default function WorkflowPage() {
  const { id } = useParams();
  const { data, isLoading: isGettingPresigned } = useGetPreSignedQuery({
    id: id.toString(),
  });
  const [handleApprove, { isLoading: isApproving }] =
    useHandleApprovalMutation();
  const [handleSubmit, { isLoading: isSubmitting }] =
    useSubmitForApprovalMutation();
  const [fileUrl, setFileUrl] = useState<string>('');
  const router = useRouter();

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

  const handleSubmitForApproval = async (mode: string) => {
    try {
      mode == 'ADJUST' &&
        (await handleApprove({
          rfxId: id as string,
          status: 'ADJUST',
        }).unwrap());
      mode == 'APPROVED' &&
        (await handleSubmit({
          id: id as string,
        }).unwrap());
      router.push('/rfx');
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
      <Flex className="ml-auto gap-4">
        <Button
          className="bg-yellow-500"
          loading={isSubmitting}
          onClick={async () => await handleSubmitForApproval('ADJUST')}
        >
          Adjust
        </Button>
        <Button
          className=""
          loading={isApproving}
          onClick={async () => await handleSubmitForApproval('APPROVED')}
        >
          Submit for approval
        </Button>
      </Flex>
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
