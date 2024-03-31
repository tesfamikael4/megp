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
import { FileViewer } from '@/app/(features)/vendor/_components/file-viewer';
import { useGetBidFormFilesQuery } from '@/app/(features)/vendor/tender/_api/invitation-document.api';

export default function BidForm({ bidFormId }: { bidFormId: string }) {
  const [opened, { open, close }] = useDisclosure(false);
  const { data: url, isLoading } = useGetBidFormFilesQuery(bidFormId);
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
              Upload
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
      </main>
    </>
  );
}
