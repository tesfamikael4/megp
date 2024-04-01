'use client';
import {
  Box,
  Button,
  Divider,
  LoadingOverlay,
  Menu,
  Modal,
  Text,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { Section, logger, notify } from '@megp/core-fe';
import {
  IconDotsVertical,
  IconDownload,
  IconEye,
  IconTrash,
  IconUpload,
  IconX,
} from '@tabler/icons-react';
import { useEffect } from 'react';
import {
  useGetFilesQuery,
  useLazyDownloadFilesQuery,
} from '@/app/(features)/preparation/_api/item/sor-document.api';
import { ExpandableTable } from '@/app/(features)/_components/expandable-table';
import { FileViewer } from '@/app/(features)/_components/file-viewer';
import { DocumentFormDetail } from './document-form-detail';
import { useDeleteMutation } from '../../../_api/item/document.api';
import { useParams, useRouter } from 'next/navigation';

export default function Document() {
  const router = useRouter();
  const { itemId } = useParams();
  const [opened, { open, close }] = useDisclosure(false);
  const { data } = useGetFilesQuery(itemId);
  const [dowloadFile, { isLoading: isDownloading }] =
    useLazyDownloadFilesQuery();
  const [remove, { isLoading: isDeleting }] = useDeleteMutation();
  const config = {
    columns: [
      {
        header: 'Description',
        accessor: 'description',
      },
      {
        accessor: 'action',
        header: 'Action',
        render: (record) => <Action document={record} />,
        width: 70,
      },
    ],
    isDeleting: isDeleting,
  };

  const Action = ({ document }: any) => {
    const [opened, { open, close }] = useDisclosure(false);
    const openDeleteModal = () => {
      modals.openConfirmModal({
        title: `Delete ${document.description}`,
        centered: true,
        children: (
          <Text size="sm">
            {`Are you sure you want to delete this ${document.description} `}
          </Text>
        ),
        labels: { confirm: 'Yes', cancel: 'No' },
        confirmProps: { color: 'red' },
        onConfirm: handleDelete,
      });
    };
    const handleDownload = async () => {
      try {
        const res = await dowloadFile(document.id).unwrap();
        await fetch(res.presignedUrl)
          .then((res) => res.blob())
          .then((blob) => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = document.fileName;
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
        await remove(document.id).unwrap();
        notifications.show({
          title: 'Success',
          message: 'Item Deleted Successfully',
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
                open();
                // handleViewer();
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
          title={document.fileName}
          size="xl"
          pos="relative"
        >
          <FilePriview data={document} />
        </Modal>
      </>
    );
  };

  const onReturnFunction = () => {
    close();
    router.refresh();
  };
  return (
    <Section
      title="Documents"
      collapsible={true}
      defaultCollapsed={true}
      className="capitalize"
      action={
        <Button leftSection={<IconUpload size={18} />} onClick={open}>
          Upload
        </Button>
      }
    >
      <ExpandableTable
        data={data?.items ?? []}
        config={config}
        total={data?.total ?? 0}
      />
      <Modal opened={opened} onClose={close} withCloseButton={false}>
        <div className="flex justify-between">
          <h2 className="font-medium text-lg capitalize">
            Upload new Document
          </h2>
          <IconX onClick={close} />
        </div>
        <Divider mt={'md'} mb={'md'} />
        <Box className="bg-white rounded shadow-sm ">
          <DocumentFormDetail returnFunction={onReturnFunction} />
        </Box>
      </Modal>
    </Section>
  );
}

const FilePriview = ({ data }: { data: any }) => {
  const [dowloadFile, { data: url, isLoading }] = useLazyDownloadFilesQuery();

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
