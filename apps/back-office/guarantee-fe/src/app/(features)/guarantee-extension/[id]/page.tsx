'use client';
import { Box, Button, Flex } from '@mantine/core';
import { Section } from '@megp/core-fe';

import { useParams } from 'next/navigation';
import { WorkflowHandling } from '../../approval/workflow';
import { DetailTable } from '../../components/detail-table';

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
          <Section title=" Guarantee Extension Detail" collapsible={false}>
            <DetailTable data={data} />

            <Flex justify="flex-end" gap={10}>
              <Button className="mt-5">Approve</Button>
              <Button variant="outline" className="mt-5">
                Reject
              </Button>
            </Flex>
          </Section>
        </Box>
        <Box className=" bg-white w-1/4">
          <WorkflowHandling itemId={id as string} itemKey={'Guarantee'} />
        </Box>
      </Flex>
    </>
  );
}
