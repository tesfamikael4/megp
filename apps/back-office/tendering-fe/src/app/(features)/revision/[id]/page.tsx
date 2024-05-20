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
import { useReadQuery as useGetTenderById } from '../_api/tender.api';
import { logger, notify } from '@megp/core-fe';
import { useCreateMutation, useReadQuery } from '../_api/revision.api';
import { useEffect } from 'react';
import { RevisionApprovalStatusEnum } from '@/models/revision/revision.model';

export default function DocumentPage() {
  const RevisionApprovalEnum = RevisionApprovalStatusEnum;
  const { id } = useParams();
  const router = useRouter();
  const { data: selected, isLoading: isTenderLoading } = useGetTenderById(
    id?.toString(),
  );

  const { data: revisionData, isLoading: isRevisionLoading } = useReadQuery(
    id?.toString(),
  );
  const [create, { isLoading: isSaving }] = useCreateMutation();
  const [trigger, { data: url, isLoading }] = useLazyGetFilesQuery();

  useEffect(() => {
    logger.log(revisionData);
  }, [revisionData]);

  const onCreate = (data) => {
    logger.log(data);
    create({ ...data, id: id?.toString() })
      .unwrap()
      .then(() => {
        notify('Success', 'Submitted successfully');
      })
      .catch((error) => {
        notify('Error', `Error while submitting ${error}`);
      });
  };

  useEffect(() => {
    trigger({
      // id: '96448925-0cfa-4781-8e8b-958cdf845fd1',
      id: id,
      type: 'main-document',
    });
  }, [id]);

  return (
    <>
      <LoadingOverlay
        visible={isLoading || isTenderLoading || isSaving || isRevisionLoading}
      />
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
                <Button loading={isSaving}>Submit</Button>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item
                  onClick={() => {
                    onCreate({
                      status: RevisionApprovalEnum.APPROVED,
                    });
                  }}
                >
                  Approve
                </Menu.Item>
                <Menu.Item
                  onClick={() => {
                    onCreate({
                      status: RevisionApprovalEnum.APPROVED_WITH_COMMENT,
                    });
                  }}
                >
                  Approve with comment
                </Menu.Item>
                <Menu.Item
                  onClick={() => {
                    onCreate({
                      status: RevisionApprovalEnum.ADJUST_WITH_COMMENT,
                    });
                  }}
                >
                  Adjust with comment
                </Menu.Item>
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
