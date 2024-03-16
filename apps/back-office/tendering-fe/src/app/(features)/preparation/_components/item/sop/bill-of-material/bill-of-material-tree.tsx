'use client';
import { Box, Divider, LoadingOverlay, Menu, Modal, Text } from '@mantine/core';
import {
  IconChevronDown,
  IconChevronRight,
  IconDotsVertical,
  IconEye,
  IconTrash,
  IconX,
} from '@tabler/icons-react';
import { DataTable } from 'mantine-datatable';
import React, { useState } from 'react';
import { BillOfMaterial } from '@/models/tender/lot/item/bill-of-material.model';
import { logger } from '@megp/core-fe';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { useDeleteMutation } from '@/app/(features)/preparation/_api/item/bill-of-material.api';
import { BillOfMaterialFormDetail } from './bill-of-material-form-detail';
import { useDisclosure } from '@mantine/hooks';

export function BillOfMaterialTreeTable({
  boq,
}: {
  boq: BillOfMaterial[];
}): React.ReactNode {
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const [adId, setId] = useState('');
  const [mode, setMode] = useState<'new' | 'detail'>('new');
  const [remove, { isLoading: isDeleting }] = useDeleteMutation();
  const [opened, { open, close }] = useDisclosure(false);
  const render = ({ record }) => (
    <NodeTree
      childrenScoring={boq.filter((s) => s.parentCode === record.code)}
      boq={boq}
      padding={10}
    />
  );
  const Action = ({ data }: any) => {
    const openDeleteModal = () => {
      modals.openConfirmModal({
        title: `Delete bill of material`,
        centered: true,
        children: (
          <Text size="sm">
            {`Are you sure you want to delete this bill of material `}
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
        notifications.show({
          title: 'Success',
          message: 'Technical boq Deleted Successfully',
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
                setId(data.id);
                setMode('detail');
                open();
                // handleViewer();
              }}
            >
              View
            </Menu.Item>

            <Menu.Item
              leftSection={<IconEye size={15} />}
              onClick={() => {
                setId(data.code);
                setMode('new');
                open();
                // handleViewer();
              }}
            >
              Add Child
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
    <>
      <LoadingOverlay visible={isDeleting} />
      <DataTable
        withColumnBorders
        highlightOnHover
        columns={[
          {
            accessor: 'description',
            title: 'Description',
            width: 300,
            noWrap: true,
            render: ({ id, description }) => (
              <>
                <div className="flex">
                  <div>
                    {expandedIds.includes(id) ? (
                      <IconChevronDown size={20} />
                    ) : (
                      <IconChevronRight size={20} />
                    )}
                  </div>
                  <span className="whitespace-pre-line">{description}</span>
                </div>
              </>
            ),
          },
          {
            accessor: 'unit',
            title: 'Unit of measure',
            width: 200,
          },
          {
            accessor: 'quantity',
            title: 'Quantity',
            width: 200,
          },
          {
            accessor: 'action',
            title: 'Action',
            render: (record) => <Action data={record} />,
            width: 70,
          },
        ]}
        records={boq.filter((score) => !score.parentCode)}
        rowExpansion={{
          allowMultiple: true,
          expanded: {
            recordIds: expandedIds,
            onRecordIdsChange: setExpandedIds,
          },
          content: render,
        }}
      />
      <Modal
        opened={opened}
        size={'xl'}
        onClose={close}
        withCloseButton={false}
      >
        <div className="flex justify-between">
          <h2 className="font-medium text-lg capitalize">Bill of Material</h2>
          <IconX onClick={close} />
        </div>
        <Divider mt={'md'} mb={'md'} />
        <Box className="bg-white rounded shadow-sm ">
          <BillOfMaterialFormDetail mode={mode} parentId={adId} />
        </Box>
      </Modal>
    </>
  );
}

export function NodeTree({
  childrenScoring,
  boq,
  padding,
}: {
  childrenScoring: BillOfMaterial[];
  boq: BillOfMaterial[];
  padding: number;
}): React.ReactNode {
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const [adId, setId] = useState('');
  const [mode, setMode] = useState<'new' | 'detail'>('new');
  const [opened, { open, close }] = useDisclosure(false);
  const [remove, { isLoading: isDeleting }] = useDeleteMutation();
  const render = ({ record }) => (
    <NodeTree
      childrenScoring={boq.filter((s) => s.parentCode === record.id)}
      boq={boq}
      padding={20 + padding}
    />
  );
  const Action = ({ data }: any) => {
    const openDeleteModal = () => {
      modals.openConfirmModal({
        title: `Delete bill of material`,
        centered: true,
        children: (
          <Text size="sm">
            {`Are you sure you want to delete this bill of material `}
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
        notifications.show({
          title: 'Success',
          message: 'bill of material Deleted Successfully',
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
              className="ml-auto text-gray-500"
              size={16}
              onClick={(e) => {
                e.stopPropagation();
              }}
            />
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item
              leftSection={<IconEye size={15} />}
              onClick={() => {
                setId(data.id);
                setMode('detail');
                open();
                // handleViewer();
              }}
            >
              View
            </Menu.Item>
            <Menu.Item
              leftSection={<IconEye size={15} />}
              onClick={() => {
                setId(data.code);
                setMode('new');
                open();
                // handleViewer();
              }}
            >
              Add Child
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
    <>
      <LoadingOverlay visible={isDeleting} />
      <DataTable
        noHeader
        withColumnBorders
        columns={[
          {
            accessor: 'description',
            title: 'Description',
            width: 300,
            noWrap: true,
            render: ({ id, description }) => (
              <>
                <div className={`flex pl-${padding}`}>
                  <div>
                    {expandedIds.includes(id) ? (
                      <IconChevronDown size={20} />
                    ) : (
                      <IconChevronRight size={20} />
                    )}
                  </div>
                  <span className="whitespace-pre-line">{description}</span>
                </div>
              </>
            ),
          },
          {
            accessor: 'unit',
            title: 'Unit of measure',
            width: 200,
          },
          {
            accessor: 'quantity',
            title: 'Quantity',
            width: 200,
          },
          {
            accessor: 'action',
            title: 'Action',
            render: (record) => <Action data={record} />,
            width: 70,
          },
        ]}
        records={childrenScoring}
        rowExpansion={{
          allowMultiple: true,
          expanded: {
            recordIds: expandedIds,
            onRecordIdsChange: setExpandedIds,
          },
          content: render,
        }}
      />
      <Modal
        opened={opened}
        size={'xl'}
        onClose={close}
        withCloseButton={false}
      >
        <div className="flex justify-between">
          <h2 className="font-medium text-lg capitalize">Technical Scoring</h2>
          <IconX onClick={close} />
        </div>
        <Divider mt={'md'} mb={'md'} />
        <Box className="bg-white rounded shadow-sm ">
          <BillOfMaterialFormDetail mode={mode} parentId={adId} />
        </Box>
      </Modal>
    </>
  );
}
