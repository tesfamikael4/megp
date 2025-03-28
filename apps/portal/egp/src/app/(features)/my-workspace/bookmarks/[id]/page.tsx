'use client';
import {
  Box,
  Button,
  Divider,
  Flex,
  LoadingOverlay,
  Modal,
  SimpleGrid,
  Text,
} from '@mantine/core';

import { useParams } from 'next/navigation';

import { useDisclosure } from '@mantine/hooks';
import { IconX } from '@tabler/icons-react';
import { useGetFilesQuery } from '@/app/(features)/procurement-notice/_api/invitation-document.api';
import { FileViewer } from '../../_components/file-viewer';
import { TenderFormDetail } from '../../_components/tender-form';

export default function BookmarkDetailPage() {
  const [opened, { open, close }] = useDisclosure(false);
  const { data: url, isLoading } = useGetFilesQuery({
    id: '96448925-0cfa-4781-8e8b-958cdf845fd1',
    type: 'main-document',
  });
  const { id } = useParams();

  return (
    <>
      <main className="mt-4">
        <Box px={{ base: 'xs', sm: 'lg' }}></Box>
        <Flex
          align={'center'}
          justify={'space-between'}
          gap={4}
          direction={{ base: 'column', sm: 'row' }}
          className="border border-b p-4 rounded-md bg-white w-full my-4"
        >
          <Text> Tender Detail</Text>
          <Flex align={'end'} justify={{ base: 'center', sm: 'flex-end' }}>
            <Button
              variant="filled"
              onClick={() => {
                open();
              }}
            >
              Register
            </Button>
          </Flex>
        </Flex>
        <Box className="">
          <LoadingOverlay visible={isLoading} />
          <FileViewer
            url={url?.presignedDownload ?? ''}
            filename="Invitation"
          />
        </Box>
        <Modal
          opened={opened}
          size={'xl'}
          onClose={close}
          withCloseButton={false}
        >
          <div className="flex justify-between">
            <h2 className="font-medium text-lg capitalize">
              Set password for your bid
            </h2>
            <IconX onClick={close} />
          </div>
          <Divider mt={'md'} mb={'md'} />
          <Box className="bg-white rounded shadow-sm ">
            <TenderFormDetail tenderId={id.toString()} />
          </Box>
        </Modal>
      </main>
    </>
  );
}
