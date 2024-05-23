'use client';
import {
  useDeleteMutation,
  useLazyListByIdQuery,
} from '../../../_api/rfx/documentary-evidence.api';
import { Button, Divider, Menu, Modal, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ExpandableTable, Section } from '@megp/core-fe';
import { CollectionQuery } from '@megp/entity';
import {
  IconDotsVertical,
  IconEye,
  IconPlus,
  IconTrash,
  IconX,
} from '@tabler/icons-react';
import DocumentaryForm from './documentary-form';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { modals } from '@mantine/modals';
import { type DocumentaryEvidence } from '@/models/tender/documentary-evidence.model';
import { notifications } from '@mantine/notifications';

export default function DocumentaryEvidence() {
  const [opened, { open, close }] = useDisclosure(false);
  const [trigger, { data, isFetching }] = useLazyListByIdQuery();
  const [mode, setMode] = useState<'new' | 'detail'>('new');
  const { id } = useParams();
  const [remove, { isLoading: isDeleting }] = useDeleteMutation();

  const config = {
    columns: [
      {
        accessor: 'documentTitle',
        title: 'Evidence Title',
        sortable: true,
      },
      {
        accessor: 'description',
        sortable: true,
      },
      {
        accessor: 'documentTitle',
        title: 'Action',
        render: (value) => <Action documentaryEvidence={value} />,
      },
    ],
    isExpandable: false,
    isSearchable: true,
    isLoading: isFetching || isDeleting,
    primaryColumn: 'evidenceTitle',
  };

  const onRequestChange = (request: CollectionQuery) => {
    trigger({
      id: id.toString(),
      collectionQuery: {
        ...request,
      },
    });
  };

  const Action = ({
    documentaryEvidence,
  }: {
    documentaryEvidence: DocumentaryEvidence;
  }) => {
    const openDeleteModal = () => {
      modals.openConfirmModal({
        title: `Delete qualification`,
        centered: true,
        children: (
          <Text size="sm">
            {`Are you sure you want to delete this documentary evidence? `}
          </Text>
        ),
        labels: { confirm: 'Yes', cancel: 'No' },
        confirmProps: { color: 'red' },
        onConfirm: handleDelete,
      });
    };
    const handleDelete = async () => {
      try {
        await remove(documentaryEvidence.id).unwrap();
        notifications.show({
          title: 'Success',
          message: `Documentary Evidence Deleted Successfully`,
          color: 'green',
        });
      } catch (err) {
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

  return (
    <Section
      title="Documentary Evidence"
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

      <Modal opened={opened} onClose={close} withCloseButton={false} size="lg">
        <div className="flex justify-between">
          <h2 className="font-medium text-lg capitalize">
            Create A Documentary Evidence
          </h2>
          <IconX onClick={close} />
        </div>
        <Divider mt={'md'} mb={'md'} />
        <DocumentaryForm mode={mode} close={close} count={data?.total} />
      </Modal>
    </Section>
  );
}
