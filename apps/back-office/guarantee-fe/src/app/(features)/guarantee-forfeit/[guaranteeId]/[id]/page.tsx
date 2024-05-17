'use client';
import { Box, Flex } from '@mantine/core';
import { Section } from '@megp/core-fe';

import { useGetGuranateeDocumentQuery } from '@/store/api/guarantee-document/guarantee-document.api';
import { useParams } from 'next/navigation';
import { WorkflowHandling } from '../../../approval/workflow';

export default function ForfeitDetail() {
  const { id, guaranteeId } = useParams();
  const { data: document } = useGetGuranateeDocumentQuery(
    guaranteeId.toLocaleString(),
  );
  return (
    <>
      <Flex gap={10} mt={10}>
        <Box className=" bg-white w-3/4 h-full">
          <Section
            title="Guarantee Document"
            collapsible={false}
            className="overflow-scroll"
          >
            <embed
              src={document?.document?.presignedUrl}
              type="application/pdf"
              width="100%"
              height="800px"
            />
          </Section>
        </Box>
        <Box className=" bg-white w-1/4">
          <WorkflowHandling itemId={id as string} itemKey={'Guarantee'} />
        </Box>
      </Flex>
    </>
  );
}
