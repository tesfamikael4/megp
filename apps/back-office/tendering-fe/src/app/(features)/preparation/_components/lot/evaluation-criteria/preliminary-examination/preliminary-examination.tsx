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
} from '@/app/(features)/preparation/_api/lot/preliminary-examination.api';
import { PreliminaryExaminationFormDetail } from './preliminary-examination-form-detail';
import { useDisclosure } from '@mantine/hooks';
import { useState } from 'react';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import type { PreliminaryExamination } from '@/models/tender/lot/preliminary-examination.model';
import { CollectionQuery } from '@megp/entity';

export default function PreliminaryExamination({
  type = 'technical',
  lotId,
}: {
  type?: 'technical' | 'financial';
  lotId: string;
}) {
  const [trigger, { data, isFetching }] = useLazyListByIdQuery();
  const [opened, { open, close }] = useDisclosure(false);
  const [adId, setId] = useState('');
  const [mode, setMode] = useState<'new' | 'detail'>('new');
  const [remove, { isLoading: isDeleting }] = useDeleteMutation();
  const config = {
    columns: [
      { accessor: 'criteria', title: 'Criterion', width: 300 },
      {
        accessor: 'itbReference',
        title: 'ITB Reference',
        width: 150,
      },
      {
        accessor: 'bidFormId',
        title: 'Bid Form Link',
        width: 150,
        render: (record) => <Box>{record.bidForm?.title}</Box>,
      },
      {
        accessor: 'action',
        header: 'Action',
        render: (record) => <Action preliminary={record} />,
        width: 70,
      },
    ],
    isExpandable: true,
    isSearchable: true,
    isLoading: isFetching || isDeleting,
    primaryColumn: 'name',
  };
  const Action = ({ preliminary }: { preliminary: PreliminaryExamination }) => {
    const openDeleteModal = () => {
      modals.openConfirmModal({
        title: `Delete preliminary examination`,
        centered: true,
        children: (
          <Text size="sm">
            {`Are you sure you want to delete this preliminary examination `}
          </Text>
        ),
        labels: { confirm: 'Yes', cancel: 'No' },
        confirmProps: { color: 'red' },
        onConfirm: handleDelete,
      });
    };
    const handleDelete = async () => {
      try {
        await remove(preliminary.id).unwrap();
        notifications.show({
          title: 'Success',
          message: 'Preliminary examination Deleted Successfully',
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
              setId(preliminary.id);
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
      id: lotId,
      collectionQuery: {
        ...request,
        includes: ['bidForm'],
        where: [
          [
            {
              column: 'type',
              value: type,
              operator: '=',
            },
          ],
        ],
      },
    });
  };
  const onReturnFunction = () => {
    close();
    trigger({
      id: lotId,
      collectionQuery: {
        includes: ['bidForm'],
        where: [
          [
            {
              column: 'type',
              value: type,
              operator: '=',
            },
          ],
        ],
      },
    });
  };
  return (
    <Section
      title={type}
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
          <h2 className="font-medium text-lg capitalize">{type}</h2>
          <IconX onClick={close} />
        </div>
        <Divider mt={'md'} mb={'md'} />
        <Box className="bg-white rounded shadow-sm ">
          <PreliminaryExaminationFormDetail
            mode={mode}
            adId={adId}
            type={type}
            lotId={lotId}
            returnFunction={onReturnFunction}
          />
        </Box>
      </Modal>
    </Section>
  );
}
