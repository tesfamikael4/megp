'use client';
import { bidders } from '@/app/(features)/evaluation/_constants/data';
import { TenderOverView } from '@/app/(features)/opening/_components/tender-overview';
import {
  ActionIcon,
  Box,
  Button,
  Flex,
  Group,
  Select,
  TextInput,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { ExpandableTable, ExpandableTableConfig, Section } from '@megp/core-fe';
import { useState } from 'react';

export default function BidPrice() {
  const biddersConfig: ExpandableTableConfig = {
    isExpandable: true,
    expandedRowContent: (record) => <ItemList />,
    columns: [
      {
        accessor: 'name',
        sortable: true,
      },
      {
        accessor: 'email',
        sortable: true,
        with: 100,
      },
      //   {
      //     accessor: '',
      //     render: (record) => (
      //       <ActionIcon
      //         variant="subtle"
      //         onClick={(e) => {
      //           e.stopPropagation();
      //           router.push(`/evaluation/lots/${tenderId}/${lotId}/${record.id}`);
      //         }}
      //       >
      //         <IconChevronRight size={14} />
      //       </ActionIcon>
      //     ),
      //     width: 70,
      //   },
    ],
  };
  return (
    <>
      <TenderOverView />

      <Section title="Price Adjustment" className="mt-2">
        <Box className="p-2">
          <Flex gap={5}>
            <Select
              data={['USD', 'EUR']}
              label="Currency"
              className="w-full"
              value={'USD'}
              disabled
            />
            <TextInput label="Rate" className="w-full" />
            <DateInput label="Date" className="w-full" />
          </Flex>
          <Flex gap={5} className="mt-2">
            <Select
              data={['USD', 'EUR']}
              className="w-full"
              value={'EUR'}
              disabled
            />
            <TextInput className="w-full" />
            <DateInput className="w-full" />
          </Flex>
          <Group className="mt-2" justify="end">
            <Button>Save</Button>
          </Group>
        </Box>
      </Section>

      <Section title="Preferential Treatment" className="mt-2" defaultCollapsed>
        <ExpandableTable
          config={biddersConfig}
          data={bidders ?? []}
          //   total={bidders?.length}
        />
      </Section>

      <Section title="Incoterm" className="mt-2" defaultCollapsed>
        Incoterm
      </Section>

      <Box className="p-2 mt-2 bg-white">
        <Group justify="end">
          <Button>Complete</Button>
        </Group>
      </Box>
    </>
  );
}

const ItemList = () => {
  const config: ExpandableTableConfig = {
    minHeight: 100,
    columns: [
      {
        accessor: 'item',
        width: 400,
      },
      {
        accessor: 'quantity',
      },
      {
        accessor: 'unitPrice',
      },
      {
        accessor: 'preferenceMargin',
        render: () => <Margin />,
      },
    ],
  };

  const Margin = () => {
    // const [isEditable, setIsEditable] = useState(false);
    return <TextInput />;
  };
  return (
    <Box className="p-5 bg-white">
      <ExpandableTable
        config={config}
        data={[
          {
            item: 'Item 1',
            quantity: '10',
            unitPrice: '10',
          },
          {
            item: 'Item 1',
            quantity: '10',
            unitPrice: '10',
          },
          {
            item: 'Item 1',
            quantity: '10',
            unitPrice: '10',
          },
        ]}
      />
      <Group className="mt-2" justify="end">
        <Button>Save</Button>
      </Group>
    </Box>
  );
};
