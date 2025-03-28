'use client';
import { Stack, Button, Modal, Group } from '@mantine/core';
import {
  ExpandableTable,
  ExpandableTableConfig,
  Section,
  logger,
  notify,
} from '@megp/core-fe';
import { useParams } from 'next/navigation';
import { useDisclosure } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import { useLazyReadQuery } from '../../_api/app.api';
import { useLazyListByIdQuery } from '../_api/budget.api';
import {
  useBulkCreateMutation,
  useLazyGetBudgetSummationQuery,
} from '@/store/api/budget/budget.api';

import DataImport from '../../_components/data-import';
import { ModalDetail } from '../_components/modal-detail';

export default function DetailPage() {
  const { id } = useParams();

  const [data, setData] = useState<any>([]);
  const [getBudgets, { data: list }] = useLazyListByIdQuery();
  const [create, { isLoading }] = useBulkCreateMutation();
  const [opened, { open, close }] = useDisclosure(false);
  const [getBudgetYear, { data: budgetYear }] = useLazyReadQuery();
  const [getBudgetSummation, { data: budgetSummation }] =
    useLazyGetBudgetSummationQuery();

  const config: ExpandableTableConfig = {
    isSearchable: true,
    primaryColumn: 'budgetCode',
    columns: [
      {
        accessor: 'budgetCode',
        title: 'Budget Code',
      },
      {
        accessor: 'allocatedBudget',
        title: 'Allocated Budget',
        textAlign: 'right',
        render: (record) => (
          <p className="text-end">
            {parseInt(record.allocatedBudget).toLocaleString('en-US', {
              style: 'currency',
              currency: record.currency,
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
              currencyDisplay: 'code',
            })}
          </p>
        ),
      },
      {
        accessor: 'revisedBudget',
        title: 'Revised Budget',
        textAlign: 'right',
        render: (record) => (
          <p className="text-end">
            {parseInt(record.revisedBudget).toLocaleString('en-US', {
              style: 'currency',
              currency: record.currency,
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
              currencyDisplay: 'code',
            })}
          </p>
        ),
      },
      {
        accessor: 'obligatedBudget',
        title: 'Obligated Budget',
        textAlign: 'right',
        render: (record) => (
          <p className="text-end">
            {parseInt(record.obligatedBudget).toLocaleString('en-US', {
              style: 'currency',
              currency: record.currency,
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
              currencyDisplay: 'code',
            })}
          </p>
        ),
      },
      {
        accessor: 'availableBudget',
        title: 'Available Budget',
        textAlign: 'right',
        render: (record) => (
          <p className="text-end">
            {parseInt(record.availableBudget).toLocaleString('en-US', {
              style: 'currency',
              currency: record.currency,
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
              currencyDisplay: 'code',
            })}
          </p>
        ),
      },
    ],
    isExpandable: true,
    expandedRowContent: (budget) => {
      return <ModalDetail data={budget} />;
    },
  };

  useEffect(() => {
    getBudgetYear(id as string);
    getBudgetSummation(id as string);
  }, [getBudgetSummation, getBudgetYear, id]);

  const onRequestChange = (request) => {
    getBudgets({
      id: id as string,
      collectionQuery: {
        ...request,
        orderBy: [
          ...request.orderBy,
          {
            column: 'budgetCode',
            direction: 'ASC',
          },
        ],
      },
    });
  };

  const handelExtractedData = (data) => {
    setData(data);
  };

  const handelOnDone = async () => {
    try {
      await create({ appId: id, budgets: data }).unwrap();
      notify('Success', 'Budget Year Uploaded Successfully');
      onRequestChange({
        skip: 0,
        top: 0,
        orderBy: [
          {
            column: 'budgetCode',
            direction: 'ASC',
          },
        ],
      });
      close();
    } catch (err) {
      logger.log(err);
      notify('Error', 'Something went wrong');
    }
  };

  const TotalBudget = () => {
    let totalBudget = 'Total Budget MKW 0.00';

    if (budgetSummation && Object.keys(budgetSummation).length !== 0) {
      let msg = 'Total Budget ';
      Object.entries(budgetSummation).map(([key, value]) => {
        msg += `${parseFloat(value as string).toLocaleString('en-US', { style: 'currency', currency: key, minimumFractionDigits: 2, maximumFractionDigits: 2, currencyDisplay: 'code' })}`;
      });
      // logger.log({ msg });
      totalBudget = msg;
    }
    return <p>{totalBudget}</p>;
  };

  return (
    <Stack>
      <Modal opened={opened} onClose={close} title="Import File" centered>
        <DataImport onDone={handelExtractedData} />
        <Group justify="end">
          <Button
            className="mt-4 ml-auto"
            onClick={handelOnDone}
            loading={isLoading}
            disabled={data.length === 0}
          >
            Done
          </Button>
        </Group>
      </Modal>
      <Section
        title={`Budget Year ${budgetYear?.budgetYear ?? ''}`}
        subTitle={<TotalBudget />}
        collapsible={false}
        action={<Button onClick={open}>Import</Button>}
      >
        <ExpandableTable
          data={list?.items ?? []}
          config={config}
          total={(list as any)?.total ?? 0}
          onRequestChange={onRequestChange}
        />
      </Section>
    </Stack>
  );
}
