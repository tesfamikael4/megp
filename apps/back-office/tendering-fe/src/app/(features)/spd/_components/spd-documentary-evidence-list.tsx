'use client';
import { Button, Divider, Flex, Menu, Modal, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ExpandableTable, Section, logger } from '@megp/core-fe';
import { CollectionQuery } from '@megp/entity';
import {
  IconCircleCheck,
  IconCircleX,
  IconDotsVertical,
  IconEye,
  IconPlus,
  IconTrash,
  IconX,
} from '@tabler/icons-react';
import React, { useState } from 'react';
import SpdDocumentaryModal from './spd-documentary-modal';
import { useParams } from 'next/navigation';
import {
  useDeleteMutation,
  useLazyListByIdQuery,
} from '../_api/spd-documentary-evidence.api';
import { notifications } from '@mantine/notifications';
import { modals } from '@mantine/modals';

export default function SpdDocumentaryEvidence() {
  const { id } = useParams();
  const [opened, { open, close }] = useDisclosure(false);
  const [trigger, { data, isFetching }] = useLazyListByIdQuery();
  const [remove, { isLoading: isDeleting }] = useDeleteMutation();
  const [dId, setDId] = useState('');
  const [mode, setMode] = useState<'new' | 'detail'>('new');
  const config = {
    columns: [
      {
        accessor: 'evidenceTitle',
        title: 'Evidence Title',
        sortable: true,
      },
      {
        accessor: 'evidenceType',
        title: 'Evidence Type',
        sortable: true,
      },
      {
        accessor: 'requiredTo',
        title: 'Required To',
        render: (evidence) => (
          <Text size="sm">
            {evidence.isRequired ? evidence.requiredTo : 'Not Required'}
          </Text>
        ),
      },
      {
        accessor: 'action',
        header: 'Action',
        render: (record) => <Action data={record} />,
        width: 70,
      },
    ],
    isExpandable: false,
    isSearchable: true,
    isLoading: isFetching || isDeleting,
    primaryColumn: 'evidenceTitle',
  };

  const onRequestChange = (request: CollectionQuery) => {
    logger.log(id.toString() ?? '');
    trigger({
      id: id.toString() ?? '',
      collectionQuery: {
        ...request,
      },
    });
  };

  const onReturnFunction = () => {
    close();
    trigger({
      id: id.toString() ?? '',
      collectionQuery: {},
    });
  };
  const Action = ({ data }: any) => {
    const openDeleteModal = () => {
      modals.openConfirmModal({
        title: `Delete Documentary Evidence`,
        centered: true,
        children: (
          <Text size="sm">
            {`Are you sure you want to delete this Documentary Evidence `}
          </Text>
        ),
        labels: { confirm: 'Yes', cancel: 'No' },
        confirmProps: { color: 'red' },
        onConfirm: handleDelete,
      });
    };
    const handleDelete = async () => {
      try {
        await remove(data.id).unwrap();
        onReturnFunction();
        notifications.show({
          title: 'Success',
          message: `Documentary Evidence Deleted Successfully`,
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
      <>
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
                setDId(data.id);
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
      </>
    );
  };

  return (
    <Section
      title="SPD Documentary Evidence"
      collapsible={true}
      defaultCollapsed={true}
      action={
        <Button
          onClick={() => {
            open();
            setMode('new');
          }}
        >
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
        size={'60%'}
        onClose={close}
        withCloseButton={false}
      >
        <div className="flex justify-between">
          <h2 className="font-medium text-lg capitalize">
            Create SPD Documentary Evidence
          </h2>
          <IconX onClick={close} />
        </div>
        <Divider mt={'md'} mb={'md'} />
        <SpdDocumentaryModal
          mode={mode}
          dId={dId ?? ''}
          returnFunction={onReturnFunction}
        />
      </Modal>
    </Section>
  );
}
