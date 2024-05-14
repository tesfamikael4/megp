'use client';
import {
  Box,
  Button,
  Divider,
  Flex,
  LoadingOverlay,
  Modal,
  Text,
} from '@mantine/core';
import { useLazyGetFilesQuery } from '../_api/invitation-document.api';
import { useBookmarkMutation } from '../_api/bookmark.api';
import { useParams } from 'next/navigation';
import { useDisclosure } from '@mantine/hooks';
import { IconX } from '@tabler/icons-react';
import { notify } from '@megp/core-fe';
import { FileViewer } from '../../_components/file-viewer';
import { TenderFormDetail } from '../../_components/tender-form';
import { useEffect } from 'react';
import { useGetTenderQuery } from '../_api/tender.api';

export default function TenderDetailPage() {
  const [opened, { open, close }] = useDisclosure(false);
  const [bookmark, { isLoading: isBookmarking }] = useBookmarkMutation();
  const [trigger, { data: url, isLoading }] = useLazyGetFilesQuery();
  const { id } = useParams();
  const { data: selected, isLoading: isTenderDetailLoading } =
    useGetTenderQuery(id?.toString());
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
  useEffect(() => {
    if (id) {
      trigger(id);
    }
  }, [id, trigger]);

  return (
    <>
      <main className="mt-4" style={{ height: 'calc(100vh - 200px)' }}>
        <LoadingOverlay visible={isTenderDetailLoading} />
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
            height={2226}
            width={1653}
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
            <TenderFormDetail
              tenderId={id.toString()}
              envelopType={selected?.bdsSubmission?.envelopType}
            />
          </Box>
        </Modal>
      </main>
    </>
  );
}
