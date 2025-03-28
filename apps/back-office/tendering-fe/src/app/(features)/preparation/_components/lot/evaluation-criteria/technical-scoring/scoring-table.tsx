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
import React, { useEffect, useState } from 'react';
import { SpdTechnicalScoring } from '@/models/spd/technical-scoring';
import { logger } from '@megp/core-fe';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { useDeleteMutation } from '@/app/(features)/preparation/_api/lot/technical-scoring.api';
import { useDisclosure } from '@mantine/hooks';
import { TechnicalScoringFormDetail } from './technical-scoring-form-detail';

export function ScoringTable({
  scoring,
  lotId,
  onRequestChange,
}: {
  scoring: SpdTechnicalScoring[];
  lotId: string;
  onRequestChange?: (request) => void;
}): React.ReactNode {
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const [adId, setId] = useState('');
  const [mode, setMode] = useState<'new' | 'detail'>('new');
  const [remove, { isLoading: isDeleting }] = useDeleteMutation();
  const [opened, { open, close }] = useDisclosure(false);
  const render = ({ record }) => (
    <NodeTree
      childrenScoring={scoring.filter((s) => s.parentId === record.id)}
      scoring={scoring}
      padding={0}
      lotId={lotId}
    />
  );
  useEffect(() => {
    onRequestChange?.({});
  }, [expandedIds]);
  const Action = ({ data }: any) => {
    const openDeleteModal = () => {
      modals.openConfirmModal({
        title: `Delete technical scoring`,
        centered: true,
        children: (
          <Text size="sm">
            {`Are you sure you want to delete this technical scoring `}
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
          message: 'Technical scoring Deleted Successfully',
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
                setId(data.id);
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

  const onReturnFunction = () => {
    close();
    onRequestChange?.({});
  };

  return (
    <>
      <LoadingOverlay visible={isDeleting} />
      <DataTable
        withColumnBorders
        highlightOnHover
        columns={[
          {
            accessor: 'requirement',
            title: 'Requirement',
            width: 500,
            noWrap: true,
            render: ({ id, requirement }) => (
              <>
                <div className="flex">
                  {expandedIds.includes(id) ? (
                    <IconChevronDown size={20} />
                  ) : (
                    <IconChevronRight size={20} />
                  )}
                  <Text className="w-full line-clamp-2">{requirement}</Text>
                </div>
              </>
            ),
          },
          {
            accessor: 'point',
            title: 'Point',
            textAlign: 'right',
            width: 200,
          },
          {
            accessor: 'action',
            title: 'Action',
            render: (record) => <Action data={record} />,
            width: 70,
          },
        ]}
        records={scoring.filter((score) => !score.parentId)}
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
          <TechnicalScoringFormDetail
            mode={mode}
            parentId={adId}
            lotId={lotId}
            returnFunction={onReturnFunction}
          />
        </Box>
      </Modal>
    </>
  );
}

export function NodeTree({
  childrenScoring,
  scoring,
  padding,
  lotId,
}: {
  childrenScoring: SpdTechnicalScoring[];
  scoring: SpdTechnicalScoring[];
  padding: number;
  lotId: string;
}): React.ReactNode {
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const [adId, setId] = useState('');
  const [mode, setMode] = useState<'new' | 'detail'>('new');
  const [opened, { open, close }] = useDisclosure(false);
  const [remove, { isLoading: isDeleting }] = useDeleteMutation();
  const render = ({ record }) => (
    <NodeTree
      childrenScoring={scoring.filter((s) => s.parentId === record.id)}
      scoring={scoring}
      padding={20 + padding}
      lotId={lotId}
    />
  );
  const Action = ({ data }: any) => {
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
        await remove(data.id).unwrap();
        notifications.show({
          title: 'Success',
          message: 'Technical scoring Deleted Successfully',
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
                setId(data.id);
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

  const onReturnFunction = () => {
    close();
  };

  return (
    <>
      <LoadingOverlay visible={isDeleting} />
      <DataTable
        noHeader
        withColumnBorders
        columns={[
          {
            accessor: 'requirement',
            noWrap: true,
            width: 500,
            render: ({ id, requirement }) => (
              <Box component="span" className="flex" ml={20 + padding}>
                {scoring.filter((s) => s.parentId === id).length > 0 &&
                  (expandedIds.includes(id) ? (
                    <IconChevronDown size={20} />
                  ) : (
                    <IconChevronRight size={20} />
                  ))}
                <Text className="w-full line-clamp-2">{requirement}</Text>
              </Box>
            ),
          },
          {
            accessor: 'point',
            title: 'Point',
            textAlign: 'right',
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
          <TechnicalScoringFormDetail
            mode={mode}
            parentId={adId}
            lotId={lotId}
            returnFunction={onReturnFunction}
          />
        </Box>
      </Modal>
    </>
  );
}
