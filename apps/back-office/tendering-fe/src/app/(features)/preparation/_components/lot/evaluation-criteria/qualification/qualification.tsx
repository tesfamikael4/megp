'use client';
import { ExpandableTable } from '@/app/(features)/_components/expandable-table';
import { Section, logger } from '@megp/core-fe';
import { Box, Button, Divider, Menu, Modal, Text } from '@mantine/core';
import {
  IconPlus,
  IconDotsVertical,
  IconEye,
  IconTrash,
  IconX,
} from '@tabler/icons-react';
import {
  useDeleteMutation,
  useLazyListByIdQuery,
} from '@/app/(features)/preparation/_api/lot/qualification.api';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { useState } from 'react';
import { QualificationFormDetail } from './qualification-form-detail';
import { useDisclosure } from '@mantine/hooks';
import { DetailQualification } from './qualification-detail';
import { Qualification } from '@/models/tender/lot/qualification.model';
import { CollectionQuery } from '@megp/entity';

export default function Qualification({
  type = 'legal',
  lotId,
}: {
  type?: 'legal' | 'professional' | 'technical' | 'financial' | 'performance';
  lotId: string;
}) {
  const [trigger, { data, isFetching }] = useLazyListByIdQuery();
  const [opened, { open, close }] = useDisclosure(false);
  const [qId, setId] = useState('');
  const [mode, setMode] = useState<'new' | 'detail'>('new');
  const [remove, { isLoading: isDeleting }] = useDeleteMutation();

  const config = {
    columns: [
      { accessor: 'factor', title: 'Factor', width: 150 },
      {
        accessor: 'requirement',
        title: 'Criterion / Requirement',
        width: 300,
      },
      {
        accessor: 'formLink',
        title: 'Document Requirement',
        width: 150,
      },
      {
        accessor: 'action',
        header: 'Action',
        render: (record) => <Action qualification={record} />,
        width: 70,
      },
    ],
    isExpandable: true,
    isSearchable: true,
    isLoading: isFetching || isDeleting,
    primaryColumn: 'factor',
    expandedRowContent: (qualification) => {
      return <DetailQualification cell={qualification} />;
    },
  };

  const Action = ({ qualification }: { qualification: Qualification }) => {
    const openDeleteModal = () => {
      modals.openConfirmModal({
        title: `Delete ${type} qualification`,
        centered: true,
        children: (
          <Text size="sm">
            {`Are you sure you want to delete this ${type} qualification `}
          </Text>
        ),
        labels: { confirm: 'Yes', cancel: 'No' },
        confirmProps: { color: 'red' },
        onConfirm: handleDelete,
      });
    };
    const handleDelete = async () => {
      try {
        await remove(qualification.id).unwrap();
        notifications.show({
          title: 'Success',
          message: `${type} qualification Deleted Successfully`,
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
          <IconDotsVertical
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="ml-auto text-gray-500"
            size={16}
          />
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Item
            leftSection={<IconEye size={15} />}
            onClick={() => {
              setId(qualification.id);
              setMode('detail');
              open();
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
        where: [
          [
            {
              column: 'category',
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
        size={'50%'}
        onClose={close}
        withCloseButton={false}
      >
        <div className="flex justify-between">
          <h2 className="font-medium text-lg capitalize">{type}</h2>
          <IconX onClick={close} />
        </div>
        <Divider mt={'md'} mb={'md'} />
        <Box className="bg-white rounded shadow-sm mx-2">
          <QualificationFormDetail
            mode={mode}
            adId={qId}
            type={type}
            lotId={lotId}
          />
        </Box>
      </Modal>
    </Section>
  );
}
