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
import { useGetFilesQuery } from '../_api/invitation-document.api';
import { FileViewer } from '../../_components/file-viewer';
import { useRegistrationMutation } from '../_api/register.api';
import { useBookmarkMutation } from '../_api/bookmark.api';
import { useParams } from 'next/navigation';
import { useDisclosure } from '@mantine/hooks';
import { TenderFormDetail } from '../../_components/tender-form';
import { IconX } from '@tabler/icons-react';
import { notify } from '@megp/core-fe';

export default function TenderDetailPage() {
  const [opened, { open, close }] = useDisclosure(false);
  const [bookmark, { isLoading: isBookmarking }] = useBookmarkMutation();
  const { data: url, isLoading } = useGetFilesQuery({
    id: '96448925-0cfa-4781-8e8b-958cdf845fd1',
    type: 'main-document',
  });
  const { id } = useParams();
  const onBookmark = async (data) => {
    bookmark(data)
      .unwrap()
      .then(() => {
        notify('Success', 'tender created successfully');
      })
      .catch(() => {
        notify('Error', 'Already Registered');
      });
  };
  return (
    <>
      <main className="mt-4" style={{ height: 'calc(100vh - 200px)' }}>
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
            <Flex
              ml={'sm'}
              className="w-fit border-b border-[var(--mantine-color-primary-filled)]"
              align={'center'}
            >
              <Button
                variant="filled"
                loading={isBookmarking}
                onClick={() => {
                  onBookmark({ tenderId: id });
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
