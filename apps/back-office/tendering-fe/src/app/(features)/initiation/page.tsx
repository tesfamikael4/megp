'use client';

import { ActionIcon, Box, Button, Container, Tabs } from '@mantine/core';
import { Section } from '@megp/core-fe';
import { IconChevronRight, IconPlus } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { ExpandableTable } from '../_components/expandable-table';

const tenderList = [
  {
    title: 'Office Furniture',
    pr: 'Annual Procurement requisition',
    budget: 345,
    opening_date: '02/05/2024',
    closing_date: '02/05/2024',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam',
  },
];

export default function Initiation() {
  const router = useRouter();

  const config = {
    columns: [
      { accessor: 'title', title: 'Name', width: 200 },
      { accessor: 'pr', title: 'Procurement Requisition', width: 200 },
      { accessor: 'budget', title: 'Budget' },
      { accessor: 'opening_date', title: 'Opening Date' },
      { accessor: 'closing_date', title: 'Closing Date' },
      { accessor: 'description', title: 'Description' },
      {
        accessor: 'id',
        title: '',
        render: (pr) => (
          <ActionIcon
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/initiation/${pr.id}`);
            }}
          >
            <IconChevronRight />
          </ActionIcon>
        ),
        width: 50,
      },
    ],
    isExpandable: true,
    primaryColumn: 'title',
    expandedRowContent: () => {
      return <div>hello</div>;
    },
  };

  return (
    <Section
      title="Tenders"
      collapsible={false}
      action={
        <Button onClick={() => router.push(`initiation/new`)}>
          <IconPlus size={14} /> New
        </Button>
      }
    >
      <Box className="">
        <Container fluid>
          <Tabs defaultValue="definition">
            <Tabs.List className=" flex-nowrap">
              <Tabs.Tab value="definition">Pending</Tabs.Tab>
              <Tabs.Tab value="activities">Approved</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="definition" className="pt-2">
              <div className="w-full pt-4">
                <ExpandableTable config={config} data={tenderList} total={2} />
              </div>
            </Tabs.Panel>

            <Tabs.Panel value="activities">
              <div></div>
            </Tabs.Panel>
          </Tabs>
        </Container>
      </Box>
    </Section>
  );
}
