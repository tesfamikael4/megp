'use client';
import {
  Box,
  Button,
  FileInput,
  Flex,
  Group,
  LoadingOverlay,
  Modal,
  SimpleGrid,
  Text,
} from '@mantine/core';

import { useParams, useSearchParams } from 'next/navigation';
import { useDisclosure } from '@mantine/hooks';
import { IconUpload } from '@tabler/icons-react';
import { FileViewer } from '@/app/(features)/_components/file-viewer';
import { useGetBidFormFilesQuery } from '@/app/(features)/procurement-notice/_api/invitation-document.api';
import { logger, notify } from '@megp/core-fe';
import { useBidFormDetailQuery } from '@/app/(features)/vendor/_api/bid-form';
import { useContext, useEffect, useState } from 'react';
import {
  useLazyDownloadFilesQuery,
  usePreSignedUrlMutation,
} from '@/app/(features)/tender-workspace/_api/bid-form';
import { PrepareBidContext } from '@/contexts/prepare-bid.context';

export default function BidForm({ bidFormId }: { bidFormId: string }) {
  const [trigger, { data: url, isLoading: isBidFormLoading }] =
    useLazyDownloadFilesQuery();
  const { data: pdf, isLoading: isBidFormPdfLoading } =
    useGetBidFormFilesQuery(bidFormId);
  const searchParams = useSearchParams();
  const [file, setFile] = useState<File[]>();
  const [retrieveNewURL] = usePreSignedUrlMutation();
  const [isLoading, setIsLoading] = useState(false);
  const prepareBidContext = useContext(PrepareBidContext);
  const { tenderId } = useParams();
  const { data: bidForm, isLoading: DetailLoading } = useBidFormDetailQuery(
    searchParams.get('form'),
  );

  const onSubmit = async (document) => {
    try {
      setIsLoading(true);
      await upload(file as unknown as FileList, document.description);
    } catch (error) {
      setIsLoading(false);
      logger.log(error);
    }
  };
  useEffect(() => {
    trigger({
      tenderId: tenderId,
      bidFormId: bidFormId,
      documentType: prepareBidContext?.documentType,
      password: prepareBidContext?.password,
    });
  }, [bidFormId, prepareBidContext, tenderId, trigger]);

  const upload = async (files: FileList | null, description: string) => {
    if (!files) {
      setIsLoading(false);
      notify('Error', 'No file selected');
      return;
    }

    const fileList = Array.from(files); // Convert FileList to Array
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      try {
        const url = await retrieveNewURL({
          value: {
            originalname: file.name,
            contentType: file.type,
          },
          tenderId: tenderId,
          bidFormId: searchParams.get('form'),
          documentType: prepareBidContext?.documentType,
          key: 'Document',
          password: prepareBidContext?.password,
        }).unwrap();
        await uploadFile(file, url.presignedUrl);
      } catch (error) {
        setIsLoading(false);
        notify('Error', 'Something went wrong while uploading document');
      }
    }
  };

  const uploadFile = async (file: File, url: string) => {
    try {
      await fetch(url, {
        method: 'PUT',
        body: file,
      });
      notify('Success', 'Document Uploaded Successfully');
      setIsLoading(false);
      close();
    } catch (error) {
      setIsLoading(false);
      notify('Error', 'Something went wrong while uploading document');
      throw error;
    }
  };
  return (
    <>
      {bidForm && (
        <main className="mt-4">
          <Box px={{ base: 'xs', sm: 'lg' }}></Box>
          <Flex
            align={'center'}
            justify={'space-between'}
            gap={4}
            direction={{ base: 'column', sm: 'row' }}
            className="border border-b p-4 rounded-md bg-white w-full my-4"
          >
            <Text> {bidForm.title} </Text>
            <Flex align={'end'} justify={{ base: 'center', sm: 'flex-end' }}>
              {logger.log(url)}
              {url && (
                <a href={url.presignedUrl} download>
                  Download template
                </a>
              )}
              <Group gap="md" justify="end">
                <FileInput
                  accept=".pdf"
                  multiple
                  className="my-2"
                  leftSection={<IconUpload />}
                  onChange={(files) => setFile(files)}
                />
                <Button
                  leftSection={<IconUpload size={18} />}
                  onClick={onSubmit}
                  loading={isLoading}
                >
                  Upload
                </Button>
                <Button variant="outline" onClick={close}>
                  Close
                </Button>
              </Group>
            </Flex>
          </Flex>
          {pdf && (
            <Box className="">
              <LoadingOverlay visible={isLoading || isBidFormPdfLoading} />
              <FileViewer
                url={pdf?.presignedDownload ?? ''}
                filename={bidForm.title}
              />
            </Box>
          )}
        </main>
      )}
    </>
  );
}
