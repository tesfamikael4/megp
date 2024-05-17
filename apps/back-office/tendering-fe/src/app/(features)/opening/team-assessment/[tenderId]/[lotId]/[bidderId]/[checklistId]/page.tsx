'use client';
import { ActionIcon, Box, Flex, LoadingOverlay, Text } from '@mantine/core';
import { ExpandableTable, Section } from '@megp/core-fe';
import { ChecklistAssessment } from '../_components/assesment';
import { IconFile, IconUsers } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import {
  useLazyGetMembersAssesmentResultQuery,
  useLazyGetSpdDetailQuery,
} from '@/store/api/tendering/tender-opening.api';
import { useParams } from 'next/navigation';

export default function ChecklistDetail() {
  const [page, setPage] = useState<'teamAssessment' | 'documentPreview'>(
    'documentPreview',
  );
  const [getTeamAssessment, { data, isLoading }] =
    useLazyGetMembersAssesmentResultQuery();
  const { lotId, bidderId, checklistId } = useParams();

  useEffect(() => {
    getTeamAssessment({ lotId, bidderId, checklistId });
  }, []);

  const [getSbd, { data: sbdData }] = useLazyGetSpdDetailQuery();

  useEffect(() => {
    getSbd(checklistId);
  }, [checklistId, getSbd]);

  return (
    <Flex gap={10}>
      <Box className=" bg-white w-2/3">
        <Section
          title={sbdData?.name ?? ''}
          collapsible={false}
          className="h-full overflow-scroll"
          action={
            <ActionIcon
              variant="subtle"
              color="gray"
              onClick={() => {
                if (page === 'documentPreview') {
                  setPage('teamAssessment');
                } else {
                  setPage('documentPreview');
                }
              }}
            >
              {page === 'teamAssessment' ? (
                <IconFile size={16} />
              ) : (
                <IconUsers size={16} />
              )}
            </ActionIcon>
          }
        >
          {page == 'documentPreview' ? (
            <embed
              src={'https://arxiv.org/pdf/1708.08021'}
              type="application/pdf"
              width="100%"
              height="400px"
            />
          ) : (
            <Box pos="relative">
              <LoadingOverlay visible={isLoading} />
              <Text className="text-center my-2 font-semibold">
                Team Members Assessment
              </Text>
              <ExpandableTable
                config={{
                  minHeight: 50,
                  columns: [
                    {
                      accessor: 'openerName',
                    },
                    {
                      accessor: 'checked',
                      title: 'Assessment',
                      render: (record) => (record.checked ? 'Yes' : 'No'),
                    },
                  ],
                }}
                data={data ?? []}
              />
            </Box>
          )}
        </Section>
      </Box>
      <Box className=" bg-white w-1/3">
        <ChecklistAssessment />
      </Box>
    </Flex>
  );
}
