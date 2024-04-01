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

import { useParams, useSearchParams } from 'next/navigation';
import { useDisclosure } from '@mantine/hooks';
import { IconX } from '@tabler/icons-react';
import { FileViewer } from '@/app/(features)/vendor/_components/file-viewer';
import { useGetBidFormFilesQuery } from '@/app/(features)/vendor/tender/_api/invitation-document.api';
import { logger } from '@megp/core-fe';
import { useBidFormDetailQuery } from '@/app/(features)/vendor/_api/bid-form';

export default function BidForm({ bidFormId }: { bidFormId: string }) {
  const { data: url, isLoading } = useGetBidFormFilesQuery(bidFormId);
  const searchParams = useSearchParams();
  const { data: bidForm, isLoading: DetailLoading } = useBidFormDetailQuery(
    searchParams.get('form'),
  );
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
              <Button
                variant="filled"
                onClick={() => {
                  logger.log;
                }}
              >
                Upload
              </Button>
            </Flex>
          </Flex>
          <Box className="">
            <LoadingOverlay visible={isLoading || DetailLoading} />
            <FileViewer
              url={url?.presignedDownload ?? ''}
              filename="Invitation"
            />
          </Box>
        </main>
      )}
    </>
  );
}
