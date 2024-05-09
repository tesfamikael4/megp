'use client';
import { useParams, useRouter } from 'next/navigation';
import { PDFHighlighter } from '../../_components/pdf-highlighter';
import { useLazyGetFilesQuery } from '../_api/bid-document.api';
import {
  Box,
  Button,
  Flex,
  LoadingOverlay,
  Menu,
  Tooltip,
} from '@mantine/core';
import { IconChevronLeft } from '@tabler/icons-react';
import { useReadQuery, useUpdateMutation } from '../_api/tender.api';
import { notify } from '@megp/core-fe';
import { useEffect } from 'react';

export default function DocumentPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: selected, isLoading: isTenderLoading } = useReadQuery(
    id?.toString(),
  );
  const [update, { isLoading: isUpdating }] = useUpdateMutation();
  const [trigger, { data: url, isLoading }] = useLazyGetFilesQuery();
  const onUpdate = (data) => {
    update({ ...data, id: id?.toString() });
    notify('Success', 'Tendering Updated successfully');
  };
  useEffect(() => {
    trigger(id);
  }, [id]);
  return (
    <>
      <LoadingOverlay visible={isLoading || isTenderLoading} />
      <div className="bg-white -mt-4 -mr-4 -ml-4">
        <div className="container mx-auto ">
          <div className="pt-10 pb-10 text-black font-bold text-2xl flex justify-between">
            <Tooltip
              label="List of Tenders"
              className="cursor-pointer"
              onClick={() => router.push(`/revision`)}
              position="top-start"
            >
              <Flex align="center">
                <IconChevronLeft />
                {selected?.name}
              </Flex>
            </Tooltip>
            <Menu
              shadow="md"
              width={200}
              trigger="hover"
              openDelay={100}
              closeDelay={400}
            >
              <Menu.Target>
                <Button loading={isUpdating}>Submit</Button>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item
                  onClick={() => {
                    onUpdate({
                      ...selected,
                      status: 'PUBLISHED',
                    });
                  }}
                >
                  Approve
                </Menu.Item>
                <Menu.Item>Approve with comment</Menu.Item>
                <Menu.Item>Adjust with comment</Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </div>
        </div>
      </div>
      <Box className="m-4">
        <PDFHighlighter
          objectId={id as string}
          pdfUrl={url?.presignedDownload}
          title="Bid Document"
        />
      </Box>
    </>
  );
}
