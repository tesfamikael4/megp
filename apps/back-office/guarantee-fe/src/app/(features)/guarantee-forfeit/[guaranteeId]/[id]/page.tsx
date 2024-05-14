'use client';
import { Box, Button, Flex } from '@mantine/core';
import { Section } from '@megp/core-fe';

import { useParams } from 'next/navigation';
import { WorkflowHandling } from '../../../approval/workflow';
import { DetailTable } from '../../../components/detail-table';

export default function ForfeitDetail() {
  const { id } = useParams();
  const data = [
    {
      key: 'Guaranter Name',
      value: 'Zemen',
    },
    {
      key: 'Validity Date',
      value: 'Mar/30/2024',
    },
    {
      key: 'Request Date',
      value: 'Mar/30/2024',
    },
  ];
  return (
    <>
      <Flex gap={10} mt={10}>
        <Box className=" bg-white w-3/4 h-full">
          <Section title=" Guarantee Forfeit Detail" collapsible={false}>
            <DetailTable data={data} />
          </Section>
        </Box>
        <Box className=" bg-white w-1/4">
          <WorkflowHandling itemId={id as string} itemKey={'Guarantee'} />
        </Box>
      </Flex>
    </>
  );
}
