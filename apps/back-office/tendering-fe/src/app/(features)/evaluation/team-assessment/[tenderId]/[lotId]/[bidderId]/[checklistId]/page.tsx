'use client';

import { ActionIcon, Box, Flex, LoadingOverlay, Text } from '@mantine/core';
import { ExpandableTable, Section } from '@megp/core-fe';
import { ChecklistAssessment } from '../_components/assesment';
import { IconFile, IconUsers } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  useLazyGetMembersAssesmentResultQuery,
  useLazyGetSpdDetailQuery,
} from '@/store/api/tendering/preliminary-compliance.api';

export default function ChecklistDetail() {
  const [page, setPage] = useState<'teamAssessment' | 'documentPreview'>(
    'documentPreview',
  );
  const [getTeamAssessment, { data, isLoading }] =
    useLazyGetMembersAssesmentResultQuery();
  const { lotId, bidderId, checklistId } = useParams();
  const [getSbd, { data: sbdData }] = useLazyGetSpdDetailQuery();

  useEffect(() => {
    getSbd(checklistId);
  }, [checklistId, getSbd]);

  useEffect(() => {
    getTeamAssessment({ lotId, bidderId, checklistId });
  }, []);
  return (
    <Flex gap={10}>
      <Box className=" bg-white w-2/3">
        <Section
          title={sbdData?.itbDescription ?? ''}
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
                      accessor: 'evaluatorName',
                      render: (record) => {
                        return (
                          record?.technicalPreliminaryAssessment
                            ?.evaluatorName ?? ''
                        );
                      },
                    },
                    {
                      accessor: 'checked',
                      title: 'Assessment',
                      render: (record) => record?.qualified ?? '',
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
