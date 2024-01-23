'use client';
import { Stack, Button, Modal, Group, Box } from '@mantine/core';
import { Section, Table, TableConfig, logger } from '@megp/core-fe';
import { useParams } from 'next/navigation';
import { useDisclosure } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import { DetailTable } from '../../_components/detail-table';
import { useLazyReadQuery } from '../../_api/app.api';
import { useLazyListByAppIdQuery } from '../_api/budget.api';
import { notifications } from '@mantine/notifications';
import { useBulkCreateMutation } from '@/store/api/budget/budget.api';
import DataImport from '../../_components/data-import';
import { ExpandableTable } from '../../_components/expandable-table';

const ModalDetail = ({ data }: { data: any }) => {
  const detailData = [
    {
      key: 'Budget Code',
      value: (data as any)?.budgetCode,
    },
    {
      key: 'Description',
      value: (data as any)?.description,
    },
    {
      key: 'Allocated Budget',
      value: parseInt((data as any)?.allocatedBudget).toLocaleString('en-US', {
        style: 'currency',
        currency: data.currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    },
    {
      key: 'Revised Budget',
      value: parseInt((data as any)?.revisedBudget).toLocaleString('en-US', {
        style: 'currency',
        currency: data.currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    },
    {
      key: 'Available Budget',
      value: parseInt((data as any)?.availableBudget).toLocaleString('en-US', {
        style: 'currency',
        currency: data.currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    },
    {
      key: 'Funding Source',
      value: (data as any)?.fundingSource,
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
    <Box className="bg-white p-5">
      <DetailTable data={detailData} />
    </Box>
  );
};

export default function DetailPage() {
  const { id } = useParams();
  const [data, setData] = useState<any>([]);
  const [getBudgets, { data: list }] = useLazyListByAppIdQuery();
  const [create, { isLoading }] = useBulkCreateMutation();
  const [opened, { open, close }] = useDisclosure(false);
  const [getBudgetYear, { data: budgetYear }] = useLazyReadQuery();

  const config = {
    columns: [
      {
        accessor: 'budgetCode',
        title: 'Budget Code',
      },
      {
        accessor: 'allocatedBudget',
        title: 'Allocated Budget',
      },
      {
        accessor: 'revisedBudget',
        title: 'Revised Budget',
      },
      {
        accessor: 'obligatedBudget',
        title: 'Obligated Budget',
      },
      {
        accessor: 'availableBudget',
        title: 'Available Budget',
      },
    ],
    isExpandable: true,
    expandedRowContent: (budget) => {
      return <ModalDetail data={budget} />;
    },
  };

  useEffect(() => {
    getBudgetYear(id as string);
  }, [getBudgetYear, id]);

  useEffect(() => {
    getBudgets(id as string);
  }, [getBudgets, id]);

  const handelExtractedData = (data) => {
    setData(data);
  };

  const handelOnDone = async () => {
    try {
      await create({ appId: id, budgets: data }).unwrap();
      notifications.show({
        title: 'Success',
        message: 'Budget Year Uploaded Successfully',
        color: 'green',
      });
      close();
    } catch (err) {
      logger.log(err);
      notifications.show({
        title: 'Error',
        message: 'Something went wrong',
        color: 'red',
      });
    }
  };
  return (
    <Stack>
      <Modal opened={opened} onClose={close} title="Import File" centered>
        <DataImport onDone={handelExtractedData} />
        <Button
          className="mt-4 ml-auto"
          onClick={handelOnDone}
          loading={isLoading}
        >
          Done
        </Button>
      </Modal>
      <Section
        title={`Budget Year ${budgetYear?.budgetYear ?? ''}`}
        subTitle={'Total Budget USD 1,234.00 MKW 2,345.68'}
        collapsible={false}
        action={<Button onClick={open}>Import</Button>}
      >
        <ExpandableTable
          data={list?.items ?? []}
          config={config}
          total={(list as any)?.total ?? 0}
        />
      </Section>
    </Stack>
  );
}
