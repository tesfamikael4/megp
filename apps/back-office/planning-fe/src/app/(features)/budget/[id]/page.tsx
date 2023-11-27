'use client';
import { Stack, Button, Modal, Group } from '@mantine/core';
import { Section, Table, TableConfig } from '@megp/core-fe';
import { useParams } from 'next/navigation';
import { useDisclosure } from '@mantine/hooks';

import DataImport from '../_components/data-import';
import { useState } from 'react';
import { DetailTable } from '../../_components/detail-table';

const ModalDetail = ({ data }: { data: any }) => {
  const [opened, { open, close }] = useDisclosure(false);
  const detailData = [
    {
      key: 'COA',
      value: (data as any)?.COA,
    },
    {
      key: 'Allocated Budget',
      value: (data as any)?.['allocated budget'].toLocaleString('en-US', {
        style: 'currency',
        currency: data.currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    },
    {
      key: 'Planned Value',
      value: (data as any)?.['planned value'].toLocaleString('en-US', {
        style: 'currency',
        currency: data.currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    },
    {
      key: 'Balance',
      value: (data as any)?.balance.toLocaleString('en-US', {
        style: 'currency',
        currency: data.currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    },
    {
      key: 'Currency',
      value: (data as any)?.currency.toLocaleString('en-US', {
        style: 'currency',
        currency: data.currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    },
    {
      key: 'Type',
      value: (data as any)?.type,
    },
  ];
  return (
    <>
      <Group justify="end">
        <Button onClick={open} variant="outline">
          See More
        </Button>
      </Group>
      <Modal
        opened={opened}
        onClose={close}
        title={'Budget Year 2022'}
        size={'lg'}
      >
        <>
          <DetailTable data={detailData} />

          <Group justify="end" gap="md" className="mt-2">
            <Button
              onClick={() => {
                close();
              }}
            >
              Close
            </Button>
          </Group>
        </>
        {/* <Table data={[data]} config={config} /> */}
      </Modal>
    </>
  );
};

export default function GroupPage() {
  const { id } = useParams();
  const [data, setData] = useState<any>([]);
  const [opened, { open, close }] = useDisclosure(false);
  const config: TableConfig<any> = {
    columns: [
      { header: 'COA', accessorKey: 'COA' },
      {
        id: 'action',
        header: 'Allocated Budget',
        accessorKey: 'allocated budget',
        cell: ({ row: { original } }) => (
          <p className="text-right">
            {original['allocated budget'].toLocaleString('en-US', {
              style: 'currency',
              currency: original.currency,
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        ),
      },

      {
        id: 'action',
        header: 'Planned Value ',
        accessorKey: 'planned value',
        cell: ({ row: { original } }) => (
          <p className="text-right">
            {original['planned value'].toLocaleString('en-US', {
              style: 'currency',
              currency: original.currency,
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        ),
      },
      {
        id: 'action',
        header: 'Balance',
        accessorKey: 'balance',
        cell: ({ row: { original } }) => (
          <p className="text-right">
            {original.balance.toLocaleString('en-US', {
              style: 'currency',
              currency: original.currency,
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        ),
      },
      {
        id: 'action',
        header: 'See more',
        accessorKey: 'see more',
        cell: ({ row: { original } }) => <ModalDetail data={original} />,
      },
    ],
  };
  return (
    <Stack>
      <Modal opened={opened} onClose={close} title="Import File" centered>
        <DataImport setData={setData} />
        <Button className="mt-4 ml-auto" onClick={close}>
          Done
        </Button>
      </Modal>
      <Section
        title={`Budget Year ${id}`}
        subTitle={'Total Budget USD 1,234.00 MKW 2,345.68'}
        collapsible={false}
        action={<Button onClick={open}>Import</Button>}
      >
        <Table data={data} config={config} />
      </Section>
    </Stack>
  );
}
