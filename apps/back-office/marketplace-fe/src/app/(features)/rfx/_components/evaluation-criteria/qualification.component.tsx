'use client';
import { ExpandableTable } from '@megp/core-fe';
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
} from '../../_api/rfx/qualification.api';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { useState } from 'react';
import { QualificationFormDetail } from './qualification-form-detail';
import { useDisclosure } from '@mantine/hooks';
import { type Qualification } from '@/models/tender/qualification.model';
import { CollectionQuery } from '@megp/entity';
import { useParams } from 'next/navigation';

export default function Qualification() {
  const [trigger, { data, isFetching }] = useLazyListByIdQuery();
  const [opened, { open, close }] = useDisclosure(false);
  const [mode, setMode] = useState<'new' | 'detail'>('new');
  const [remove, { isLoading: isDeleting }] = useDeleteMutation();
  const { id } = useParams();

  const config = {
    columns: [
      {
        accessor: 'criteria',
        title: 'Criterion / Requirement',
        width: 300,
      },
      {
        accessor: 'action',
        header: 'Action',
        textAlign: 'left',
        render: (record) => <Action qualification={record} />,
        width: 70,
      },
    ],
    isExpandable: false,
    isSearchable: true,
    isLoading: isFetching || isDeleting,
    primaryColumn: 'factor',
  };

  const Action = ({ qualification }: { qualification: Qualification }) => {
    const openDeleteModal = () => {
      modals.openConfirmModal({
        title: `Delete qualification`,
        centered: true,
        children: (
          <Text size="sm">
            {`Are you sure you want to delete this qualification `}
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
          message: `Qualification Deleted Successfully`,
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
            className="text-gray-500 cursor-pointer"
            size={16}
          />
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Item
            leftSection={<IconEye size={15} />}
            onClick={() => {
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
      id: id.toString(),
      collectionQuery: {
        ...request,
      },
    });
  };

  return (
    <Section
      title={'Qualification'}
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
          <h2 className="font-medium text-lg capitalize">Qualification</h2>
          <IconX onClick={close} />
        </div>
        <Divider mt={'md'} mb={'md'} />
        <Box className="bg-white rounded shadow-sm mx-2">
          <QualificationFormDetail mode={mode} close={close} />
        </Box>
      </Modal>
    </Section>
  );
}
