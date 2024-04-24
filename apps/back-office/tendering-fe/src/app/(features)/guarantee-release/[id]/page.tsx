'use client';
import { Box, Button, Flex, Textarea } from '@mantine/core';
import { Section } from '@megp/core-fe';

import { DetailTable } from '../../_components/detail-table';

export default function ReleaseDetail() {
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
      <Box className=" bg-white w-full h-full">
        <Section title=" Guarantee Release Detail" collapsible={false}>
          <DetailTable data={data} />
          <Flex justify="space-between" gap={10}>
            <Textarea className="mt-5 w-full" label="Remark" />
            <Textarea className="mt-5 w-full" label="Reason" />
          </Flex>
          <Flex justify="flex-end" gap={10}>
            <Button className="mt-5">Release</Button>
          </Flex>
        </Section>
      </Box>
    </>
  );
}
