'use client';
import { Box, Flex } from '@mantine/core';
import { Section } from '@megp/core-fe';
import { ChecklistAssessment } from '../_components/assesment';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { useLazyGetSpdDetailQuery } from '@/store/api/tendering/technical-responsiveness.api';

export default function ChecklistDetail() {
  const { checklistId } = useParams();
  const [getSbd, { data }] = useLazyGetSpdDetailQuery();

  useEffect(() => {
    getSbd(checklistId);
  }, [checklistId, getSbd]);
  return (
    <Flex gap={10}>
      <Box className=" bg-white w-2/3">
        <Section
          title={data?.requirement ?? ''}
          collapsible={false}
          className="h-full overflow-scroll"
        >
          <embed
            src={'https://arxiv.org/pdf/1708.08021'}
            type="application/pdf"
            width="100%"
            height="400px"
          />
        </Section>
      </Box>
      <Box className=" bg-white w-1/3">
        <ChecklistAssessment />
      </Box>
    </Flex>
  );
}
