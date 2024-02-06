'use client';

import { ExpandableTable } from '@/app/(features)/_components/expandable-table';
import { Section } from '@megp/core-fe';
import { useRouter } from 'next/navigation';
import { ActionIcon, Box, Button, Divider, Group, Modal } from '@mantine/core';
import { IconChevronRight, IconPlus } from '@tabler/icons-react';
import { DetailRequisition } from '@/app/(features)/_components/detail-requisition-list';
import { useLazyListQuery } from './_api/procurement-requisition.api';
import { useDisclosure } from '@mantine/hooks';
import { FormDetail } from './_components/form-detail';

export default function ProcurementRequisition() {
  const [trigger, { data, isLoading }] = useLazyListQuery();
  const router = useRouter();
  const [opened, { open, close }] = useDisclosure(false);

  const config = {
    columns: [
      { accessor: 'requisitionReferenceNumber', title: '#Ref', width: 150 },
      { accessor: 'title', title: 'Title', width: 200 },
      { accessor: 'description', title: 'Description', width: 250 },
      { accessor: 'status', title: 'Status', width: 100 },
      {
        accessor: 'calculatedAmount',
        title: 'Total Amount',
        textAlign: 'right',
        render: (activity) => (
          <>
            {parseInt(activity.calculatedAmount).toLocaleString('en-US', {
              style: 'currency',
              currency: activity.currency,
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
              currencyDisplay: 'code',
            })}
          </>
        ),
        width: 150,
      },
      {
        accessor: 'id',
        title: '',
        render: (pr) => (
          <ActionIcon
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/procurement-requisition/${pr.id}`);
            }}
          >
            <IconChevronRight />
          </ActionIcon>
        ),
        width: 50,
      },
    ],
    isExpandable: true,
    isSearchable: true,
    isLoading: isLoading,
    primaryColumn: 'title',
    expandedRowContent: (requisition) => {
      return <DetailRequisition requisition={requisition} />;
    },
  };

  const onRequestChange = (request: any) => {
    trigger(request);
  };

  return (
    <Section
      title="Procurement Requisition"
      collapsible={false}
      action={
        <Button onClick={open}>
          <IconPlus size={14} /> Add
        </Button>
      }
    >
      <ExpandableTable
        config={config}
        data={data?.items ?? []}
        total={data?.total ?? 0}
        onRequestChange={onRequestChange}
      />
      <Modal
        opened={opened}
        onClose={close}
        size={'lg'}
        title={
          <Group className=" text-lg font-medium ">
            New Procurement Requisition
          </Group>
        }
      >
        <div className="border">
          <div className="m-4">
            <FormDetail mode="new" />
          </div>
        </div>
      </Modal>
    </Section>
  );
}
