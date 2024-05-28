'use client';
import { useParams } from 'next/navigation';
import { LotOverview } from '../../../_components/lot-overview';
import { ExpandableTable, Section } from '@megp/core-fe';
import { DateInput } from '@mantine/dates';
import { Box, Button, Flex, Group, TextInput } from '@mantine/core';
import { useState } from 'react';
import { ItemRule } from './_components/item-rule';

export default function Financial() {
  const { lotId, tenderId } = useParams();

  const [conversionData] = useState([
    {
      local_currency: '1 ETB',
      foreign_currency: 'USD',
      conversion_rate: 0.004,
    },
    {
      local_currency: '1 ETB',
      foreign_currency: 'EUR',
      conversion_rate: 0.004,
    },
  ]);
  const config = {
    minHeight: 100,
    columns: [
      {
        accessor: 'local_currency',
      },
      {
        accessor: 'conversion_rate',
        render: (record) => {
          return <TextInput rightSection={record.foreign_currency} />;
        },
      },
    ],
  };
  return (
    <>
      <LotOverview
        milestone="technicalResponsiveness"
        basePath={`/evaluation/${tenderId}/${lotId}`}
      />
      <Section className="mt-2" title="Conversion Rate" collapsible={false}>
        <Flex align="end" gap={10}>
          <DateInput label="Conversion Rate Date" className="w-1/2" />
          <Button>Save</Button>
        </Flex>

        <Box className="mt-2">
          <ExpandableTable config={config} data={conversionData} />
        </Box>
        <Group justify="end" className="mt-2">
          <Button>Save</Button>
        </Group>
      </Section>
      <Section className="mt-2" title="Item Rules" collapsible={false}>
        <ItemRule />
      </Section>
    </>
  );
}
