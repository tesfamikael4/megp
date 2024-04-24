'use client';
import { ExpandableTable } from '@/app/(features)/_components/expandable-table';
import { Section, logger } from '@megp/core-fe';
import { Box, Button, Divider, Menu, Modal, Text } from '@mantine/core';
import {
  IconDotsVertical,
  IconEye,
  IconPlus,
  IconTrash,
  IconX,
} from '@tabler/icons-react';
import {
  useDeleteMutation,
  useLazyListByIdQuery,
} from '@/app/(features)/preparation/_api/item/reimburseable-expense.api';
import { useDisclosure } from '@mantine/hooks';
import { useState } from 'react';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import type { ReimburseableExpense } from '@/models/tender/lot/item/reimburseable-expense.model';
import { CollectionQuery } from '@megp/entity';
import { Item } from '@/models/tender/lot/item';
import { ReimburseableExpenseFormDetail } from './reimburseable-expense-form-detail';

export default function ReimburseableExpense({ item }: { item: Item }) {
  const [trigger, { data, isFetching }] = useLazyListByIdQuery();
  const [opened, { open, close }] = useDisclosure(false);
  const [adId, setId] = useState('');
  const [mode, setMode] = useState<'new' | 'detail'>('new');
  const [remove, { isLoading: isDeleting }] = useDeleteMutation();
  const config = {
    columns: [
      { accessor: 'category', title: 'Category', width: 300 },
      {
        accessor: 'description',
        title: 'Description',
        width: 150,
      },
      { accessor: 'quantity', title: 'Quantity', width: 150 },
      { accessor: 'unit', title: 'Unit of measure', width: 150 },
      {
        accessor: 'action',
        header: 'Action',
        render: (record) => <Action reimburseableExpense={record} />,
        width: 70,
      },
    ],
    isExpandable: true,
    isSearchable: true,
    isLoading: isFetching || isDeleting,
    primaryColumn: 'name',
  };
  const Action = ({
    reimburseableExpense,
  }: {
    reimburseableExpense: ReimburseableExpense;
  }) => {
    const openDeleteModal = () => {
      modals.openConfirmModal({
        title: `Delete reimburseable expense`,
        centered: true,
        children: (
          <Text size="sm">{`Are you sure you want to delete this reimburseable expense `}</Text>
        ),
        labels: { confirm: 'Yes', cancel: 'No' },
        confirmProps: { color: 'red' },
        onConfirm: handleDelete,
      });
    };
    const handleDelete = async () => {
      try {
        await remove(reimburseableExpense.id).unwrap();
        notifications.show({
          title: 'Success',
          message: 'reimburseable expense Deleted Successfully',
          color: 'green',
        });
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
      <Menu shadow="md">
        <Menu.Target>
          <IconDotsVertical className="ml-auto text-gray-500" size={16} />
        </Menu.Target>

        <Menu.Dropdown
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Menu.Item
            leftSection={<IconEye size={15} />}
            onClick={() => {
              setId(reimburseableExpense.id);
              setMode('detail');
              open();
              // handleViewer();
            }}
          >
            View
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item
            color="red"
            leftSection={<IconTrash size={15} />}
            onClick={openDeleteModal}
          >
            Delete
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    );
  };

  const onRequestChange = (request: CollectionQuery) => {
    trigger({
      id: item.id,
      collectionQuery: {
        ...request,
      },
    });
  };

  const onReturnFunction = () => {
    close();
    trigger({
      id: item.id,
      collectionQuery: { where: [] },
    });
  };

  return (
    <Section
      title="Reimburseable Expense"
      collapsible={true}
      defaultCollapsed={true}
      className="capitalize"
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
        size={'xl'}
        onClose={close}
        withCloseButton={false}
      >
        <div className="flex justify-between">
          <h2 className="font-medium text-lg capitalize">
            Reimburseable Expense
          </h2>
          <IconX onClick={close} />
        </div>
        <Divider mt={'md'} mb={'md'} />
        <Box className="bg-white rounded shadow-sm ">
          <ReimburseableExpenseFormDetail
            mode={mode}
            reimburseableExpenseId={adId}
            returnFunction={onReturnFunction}
          />
        </Box>
      </Modal>
    </Section>
  );
}
