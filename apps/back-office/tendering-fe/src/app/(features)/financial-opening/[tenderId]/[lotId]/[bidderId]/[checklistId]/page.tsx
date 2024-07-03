'use client';
import { Box, Flex } from '@mantine/core';
import { Section } from '@megp/core-fe';
import { ChecklistAssessment } from '../_components/assesment';
import { useParams } from 'next/navigation';
import { useLazyGetSpdDetailQuery } from '@/store/api/tendering/tender-opening.api';
import { useEffect } from 'react';
import Document from '@/app/(features)/opening/_components/document';
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
          title={data?.name ?? ''}
          collapsible={false}
          className="h-full overflow-scroll"
        >
          <Document />
        </Section>
      </Box>
      <Box className=" bg-white w-1/3">
        <ChecklistAssessment />
      </Box>
    </Flex>
  );
}
