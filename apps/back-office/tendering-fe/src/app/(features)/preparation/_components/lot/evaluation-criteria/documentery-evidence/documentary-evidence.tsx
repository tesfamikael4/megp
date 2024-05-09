'use client';
import {
  useDeleteMutation,
  useLazyListByIdQuery,
} from '@/app/(features)/preparation/_api/lot/documentary-evidence.api';
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
import DocumentaryForm from './documentary-form';
import type { DocumentaryEvidence } from '@/models/tender/lot/documentary-evidence.model';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';

interface DocumentaryEvidenceProps {
  lotId: string;
}
export default function DocumentaryEvidence({
  lotId,
}: DocumentaryEvidenceProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const [adId, setId] = useState('');
  const [mode, setMode] = useState<'new' | 'detail'>('new');
  const [trigger, { data, isFetching }] = useLazyListByIdQuery();
  const [remove, { isLoading: isDeleting }] = useDeleteMutation();

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
        accessor: 'checkOnSecondOpening',
        header: 'Documentary Check',
        render: (evidence) => (
          <Flex direction="column" gap={'sm'}>
            <Flex gap={'sm'}>
              {evidence.checkOnFirstCompliance ? (
                <IconCircleCheck className="w-4" />
              ) : (
                <IconCircleX className="w-4" />
              )}
              <Text size="sm">Check On First Compliance</Text>
            </Flex>
            <Flex gap={'sm'}>
              {evidence.checkOnFirstOpening ? (
                <IconCircleCheck className="w-4" />
              ) : (
                <IconCircleX className="w-4" />
              )}
              <Text size="sm">Check On First Opening</Text>
            </Flex>
            <Flex gap={'sm'}>
              {evidence.checkOnSecondCompliance ? (
                <IconCircleCheck className="w-4" />
              ) : (
                <IconCircleX className="w-4" />
              )}
              <Text size="sm">Check On Second Compliance</Text>
            </Flex>
            <Flex gap={'sm'}>
              {evidence.checkOnSecondOpening ? (
                <IconCircleCheck className="w-4" />
              ) : (
                <IconCircleX className="w-4" />
              )}
              <Text size="sm">Check On Second Opening</Text>
            </Flex>
          </Flex>
        ),
      },
      {
        accessor: 'action',
        header: 'Action',
        render: (record) => <Action documentaryEvidence={record} />,
        width: 70,
      },
    ],
    isExpandable: false,
    isSearchable: true,
    isLoading: isFetching || isDeleting,
    primaryColumn: 'evidenceTitle',
  };
  const Action = ({
    documentaryEvidence,
  }: {
    documentaryEvidence: DocumentaryEvidence;
  }) => {
    const openDeleteModal = () => {
      modals.openConfirmModal({
        title: `Delete documentaryEvidence examination`,
        centered: true,
        children: (
          <Text size="sm">
            {`Are you sure you want to delete this documentaryEvidence examination `}
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
              setId(documentaryEvidence.id);
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
      },
    });
  };

  const onReturnFunction = () => {
    close();
    trigger({
      id: lotId,
      collectionQuery: {},
    });
  };

  return (
    <Section
      title="Documentary Evidence"
      collapsible={true}
      defaultCollapsed={true}
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
        size={'60%'}
        onClose={close}
        withCloseButton={false}
      >
        <div className="flex justify-between">
          <h2 className="font-medium text-lg capitalize">
            Create A Documentary Evidence
          </h2>
          <IconX onClick={close} />
        </div>
        <Divider mt={'md'} mb={'md'} />
        <DocumentaryForm
          mode={mode}
          adId={adId}
          returnFunction={onReturnFunction}
          lotId={lotId}
        />
      </Modal>
    </Section>
  );
}
