'use client';
import {
  Box,
  Button,
  Flex,
  LoadingOverlay,
  SimpleGrid,
  Text,
} from '@mantine/core';
import { useGetFilesQuery } from '../_api/invitation-document.api';
import { FileViewer } from '../../_components/file-viewer';
import { useRegistrationMutation } from '../_api/register.api';
import { useBookmarkMutation } from '../_api/bookmark.api';
import { useParams } from 'next/navigation';

export default function TenderDetailPage() {
  const [register, { isLoading: isRegistering }] = useRegistrationMutation();
  const [bookmark, { isLoading: isBookmarking }] = useBookmarkMutation();
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
              loading={isRegistering}
              onClick={() => {
                register({ tenderId: id });
              }}
            >
              Register
            </Button>
            <Flex
              ml={'sm'}
              className="w-fit border-b border-[var(--mantine-color-primary-filled)]"
              align={'center'}
            >
              <Button
                variant="filled"
                loading={isBookmarking}
                onClick={() => {
                  bookmark({ tenderId: id });
                }}
              >
                Bookmark
              </Button>
            </Flex>
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
