'use client';
import { useParams, useRouter } from 'next/navigation';
import { PDFHighlighter } from '../../_components/pdf-highlighter';
import { useGetFilesQuery } from '../_api/bid-document.api';
import { Box, Button, Flex, LoadingOverlay, Tooltip } from '@mantine/core';
import { IconChevronLeft } from '@tabler/icons-react';
import { useReadQuery, useUpdateMutation } from '../_api/tender.api';
import { notify } from '@megp/core-fe';

export default function DocumentPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: selected, isLoading: isTenderLoading } = useReadQuery(
    id?.toString(),
  );
  const [update, { isLoading: isUpdating }] = useUpdateMutation();
  const { data: url, isLoading } = useGetFilesQuery({
    id: '96448925-0cfa-4781-8e8b-958cdf845fd1',
    type: 'main-document',
  });
  const onUpdate = (data) => {
    update({ ...data, id: id?.toString() });
    notify('Success', 'Tendering Updated successfully');
  };
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
            <Button
              variant="filled"
              className="my-auto"
              loading={isUpdating}
              onClick={() => {
                onUpdate({
                  ...selected,
                  status: 'PUBLISHED',
                });
              }}
            >
              Submit
            </Button>
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
