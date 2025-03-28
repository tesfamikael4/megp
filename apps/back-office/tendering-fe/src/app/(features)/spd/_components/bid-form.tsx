'use client';
import { ExpandableTable } from '@/app/(features)/_components/expandable-table';
import { Section, logger, notify } from '@megp/core-fe';
import {
  Box,
  Button,
  Divider,
  LoadingOverlay,
  Menu,
  Modal,
  Text,
} from '@mantine/core';
import {
  IconDotsVertical,
  IconDownload,
  IconEye,
  IconPlus,
  IconTrash,
  IconX,
} from '@tabler/icons-react';
import { useDeleteMutation, useLazyListByIdQuery } from '../_api/bid-form.api';
import { BidFormFormDetail } from './bid-form-form-detail';
import { useDisclosure } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { CollectionQuery } from '@megp/entity';
import { FileViewer } from '../../_components/file-viewer/file-viewer';
import { useLazyGetFilesQuery } from '../_api/bid-form-upload.api';

export default function BidForm({ spdId }: { spdId: string }) {
  const [trigger, { data, isFetching }] = useLazyListByIdQuery();
  const [opened, { open, close }] = useDisclosure(false);
  const [dowloadFile, { isLoading: isDownloading }] = useLazyGetFilesQuery();
  const [remove, { isLoading: isDeleting }] = useDeleteMutation();

  const onReturnFunction = () => {
    close();
    trigger({
      id: spdId,
      collectionQuery: { where: [] },
    });
  };
  const config = {
    columns: [
      { accessor: 'title', title: 'Title', width: 300 },
      {
        accessor: 'code',
        title: 'Code',
        width: 150,
      },
      { accessor: 'type', title: 'Type', width: 150 },
      {
        accessor: 'action',
        header: 'Action',
        render: (record) => (
          <Action bidForm={record} returnFunction={onReturnFunction} />
        ),
        width: 70,
      },
    ],
    isExpandable: true,
    isSearchable: true,
    isLoading: isFetching || isDeleting,
    primaryColumn: 'name',
  };
  const Action = ({
    bidForm,
    returnFunction,
  }: {
    bidForm: any;
    returnFunction: () => void;
  }) => {
    const [opened, { open, close }] = useDisclosure(false);
    const openDeleteModal = () => {
      modals.openConfirmModal({
        title: `Delete bid form`,
        centered: true,
        children: (
          <Text size="sm">
            {`Are you sure you want to delete this bid form `}
          </Text>
        ),
        labels: { confirm: 'Yes', cancel: 'No' },
        confirmProps: { color: 'red' },
        onConfirm: handleDelete,
      });
    };
    const handleDownload = async () => {
      try {
        const res = await dowloadFile(bidForm.id).unwrap();
        await fetch(res.presignedUrl)
          .then((res) => res.blob())
          .then((blob) => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = bidForm.title;
            document.body.appendChild(a);
            a.click();
          });
        notify('Success', 'File downloaded successfully');
      } catch (err) {
        notify('Error', 'Something went wrong');
      }
    };
    const handleDelete = async () => {
      try {
        await remove(bidForm.id).unwrap();
        returnFunction();
        notifications.show({
          title: 'Success',
          message: 'Bid form Deleted Successfully',
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
                open();
              }}
            >
              View
            </Menu.Item>
            <Menu.Item
              leftSection={<IconDownload size={15} />}
              onClick={handleDownload}
              disabled={isDownloading}
            >
              Download
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
        <Modal
          opened={opened}
          onClose={close}
          title={bidForm.title}
          size="xl"
          pos="relative"
        >
          <FilePriview data={bidForm} />
        </Modal>
      </>
    );
  };

  const onRequestChange = (request: CollectionQuery) => {
    trigger({ id: spdId, collectionQuery: request });
  };

  return (
    <Section
      title="Bid Form"
      collapsible={false}
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
          <h2 className="font-medium text-lg capitalize">Bid Form</h2>
          <IconX onClick={close} />
        </div>
        <Divider mt={'md'} mb={'md'} />
        <Box className="bg-white rounded shadow-sm ">
          <BidFormFormDetail
            mode="new"
            adId=""
            returnFunction={onReturnFunction}
          />
        </Box>
      </Modal>
    </Section>
  );
}

const FilePriview = ({ data }: { data: any }) => {
  const [dowloadFile, { data: url, isLoading }] = useLazyGetFilesQuery();

  useEffect(() => {
    dowloadFile(data.id);
  }, [data]);
  return (
    <>
      <LoadingOverlay visible={isLoading} />
      <FileViewer url={url?.presignedDownload ?? ''} filename={data.fileName} />
    </>
  );
};
