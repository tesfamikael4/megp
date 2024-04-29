'use client';
import { ExpandableTable } from '@/app/(features)/_components/expandable-table';
import { Section, logger } from '@megp/core-fe';
import {
  Box,
  Button,
  Divider,
  Menu,
  Modal,
  Text,
  LoadingOverlay,
} from '@mantine/core';
import {
  IconDotsVertical,
  IconEye,
  IconPlus,
  IconTrash,
  IconX,
} from '@tabler/icons-react';
import {
  useDeleteMutation,
  useLazyListQuery,
} from '../_api/preference-margin.api';
import { useDisclosure } from '@mantine/hooks';
import { SpdPreferenceMarginFormDetail } from './preference-margin-form-detail';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { useState } from 'react';
import { useParams } from 'next/navigation';

export default function SpdPreferenceMargin() {
  const { id } = useParams();
  const [trigger, { data, isFetching }] = useLazyListQuery();
  const [opened, { open, close }] = useDisclosure(false);
  const [pmId, setId] = useState('');
  const [mode, setMode] = useState<'new' | 'detail'>('new');
  const [remove, { isLoading: isDeleting }] = useDeleteMutation();
  const config = {
    columns: [
      { accessor: 'condition', title: 'Condition', width: 150 },
      { accessor: 'description', title: 'Description', width: 150 },
      { accessor: 'margin', title: 'Margin', width: 150 },
      {
        accessor: 'action',
        header: 'Action',
        render: (record) => <Action data={record} />,
        width: 70,
      },
    ],
    isExpandable: false,
    isSearchable: true,
    isLoading: isFetching,
    primaryColumn: 'name',
  };

  const onReturnFunction = () => {
    close();
    trigger({
      where: [
        [
          {
            column: 'spdId',
            value: id,
            operator: '=',
          },
        ],
      ],
    });
  };

  const Action = ({ data }: any) => {
    const openDeleteModal = () => {
      modals.openConfirmModal({
        title: `Delete Document`,
        centered: true,
        children: (
          <Text size="sm">
            {`Are you sure you want to delete this Document `}
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
          message: 'Document Deleted Successfully',
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
            <IconDotsVertical className="ml-auto text-gray-500" size={16} />
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

  const onRequestChange = (request: any) => {
    trigger({
      ...request,
      where: [
        [
          {
            column: 'spdId',
            value: id,
            operator: '=',
          },
        ],
      ],
    });
  };

  return (
    <Section
      title="Preference Margin"
      collapsible={true}
      defaultCollapsed={true}
      action={
        <Button onClick={open}>
          <IconPlus size={14} /> Add
        </Button>
      }
    >
      <LoadingOverlay
        visible={isDeleting}
        zIndex={1000}
        overlayProps={{ radius: 'sm', blur: 2 }}
      />
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
          <h2 className="font-medium text-lg capitalize">Preference Margin</h2>
          <IconX onClick={close} />
        </div>
        <Divider mt={'md'} mb={'md'} />
        <Box className="bg-white rounded shadow-sm ">
          <SpdPreferenceMarginFormDetail
            mode={mode}
            pmId={pmId}
            returnFunction={onReturnFunction}
          />
        </Box>
      </Modal>
    </Section>
  );
}
