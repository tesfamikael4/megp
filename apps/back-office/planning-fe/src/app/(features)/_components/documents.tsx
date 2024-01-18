'use client';

import {
  Box,
  Button,
  FileInput,
  Group,
  LoadingOverlay,
  Menu,
  Modal,
  Text,
  TextInput,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { Table, TableConfig, logger, notify } from '@megp/core-fe';
import {
  IconDotsVertical,
  IconDownload,
  IconEye,
  IconTrash,
  IconUpload,
} from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  useGetFilesQuery,
  useLazyDownloadFilesQuery,
  usePreSignedUrlMutation,
} from '@/store/api/pre-budget-plan/pre-budget-plan.api';
import { useParams } from 'next/navigation';
import { ExpandableTable } from './expandable-table';
import { FileViewer } from './file-viewer';

export const Documents = ({
  disableFields = false,
}: {
  disableFields?: boolean;
}) => {
  const [opened, { open, close }] = useDisclosure(false);
  const { id } = useParams();
  // const [data, setData] = useState<any[]>([]);
  const [file, setFile] = useState<File[]>();
  const { register, handleSubmit } = useForm();
  const [retrieveNewURL] = usePreSignedUrlMutation();
  const { data } = useGetFilesQuery(id);
  const [dowloadFile, { isLoading: isDownloading }] =
    useLazyDownloadFilesQuery();
  const [isLoading, setIsLoading] = useState(false);
  const config = {
    columns: [
      {
        header: 'Name',
        accessor: 'fileName',
      },
      {
        accessor: 'action',
        header: 'Action',
        render: (record) => <Action data={record} />,
        width: 70,
      },
    ],
  };

  const Action = ({ data }: any) => {
    const [opened, { open, close }] = useDisclosure(false);
    const openDeleteModal = () => {
      modals.openConfirmModal({
        title: `Delete ${data.name}`,
        centered: true,
        children: (
          <Text size="sm">
            {`Are you sure you want to delete this ${data.name} `}
          </Text>
        ),
        labels: { confirm: 'Yes', cancel: 'No' },
        confirmProps: { color: 'red' },
        onConfirm: handleDelete,
      });
    };
    const handleDownload = async () => {
      try {
        const res = await dowloadFile(data.id).unwrap();
        await fetch(res.presignedUrl)
          .then((res) => res.blob())
          .then((blob) => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = data.fileName;
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
        // await remove(cell.id).unwrap();
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
              disabled={disableFields}
            >
              Delete
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>

        <Modal
          opened={opened}
          onClose={close}
          title={data.fileName}
          size="xl"
          pos="relative"
        >
          <FilePriview data={data} />
        </Modal>
      </>
    );
  };

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      await upload(file as unknown as FileList, data.name);
    } catch (error) {
      setIsLoading(false);
      logger.log(error);
    }
  };

  const upload = async (files: FileList | null, name: string) => {
    if (!files) {
      setIsLoading(false);
      notify('Error', 'No file selected');
      return;
    }

    const fileList = Array.from(files); // Convert FileList to Array
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      try {
        const url = await retrieveNewURL({
          originalname: file.name,
          contentType: file.type,
          name: name,
          preBudgetPlanActivityId: id,
        }).unwrap();
        await uploadFile(file, url.presignedUrl);
      } catch (error) {
        setIsLoading(false);
        notify('Error', 'Something went wrong while uploading document');
      }
    }
  };

  const uploadFile = async (file: File, url: string) => {
    try {
      await fetch(url, {
        method: 'PUT',
        body: file,
      });
      notify('Success', 'Document Uploaded Successfully');
      setIsLoading(false);
      close();
    } catch (error) {
      setIsLoading(false);
      notify('Error', 'Something went wrong while uploading document');
      throw error;
    }
  };

  return (
    <Box className="pt-2">
      <Group justify="end" className="pb-2">
        <Button
          leftSection={<IconUpload size={18} />}
          onClick={open}
          disabled={disableFields}
        >
          Upload
        </Button>
      </Group>
      {/* <Table data={data?.items ?? []} config={config} /> */}
      <ExpandableTable data={data?.items ?? []} config={config} />

      <Modal title="Upload New Document" opened={opened} onClose={close}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextInput label="Name" {...register('name')} required withAsterisk />

          <FileInput
            accept="*/*"
            // id="selector"
            multiple
            label="Document"
            withAsterisk
            className="my-2"
            leftSection={<IconUpload />}
            onChange={(files) => setFile(files)}
          />
          <Group gap="md" justify="end">
            <Button
              leftSection={<IconUpload size={18} />}
              type="submit"
              loading={isLoading}
            >
              Upload
            </Button>
            <Button variant="outline" onClick={close}>
              Close
            </Button>
          </Group>
        </form>
      </Modal>
    </Box>
  );
};

const FilePriview = ({ data }: { data: any }) => {
  const [dowloadFile, { data: url, isLoading }] = useLazyDownloadFilesQuery();

  useEffect(() => {
    dowloadFile(data.id);
  }, [data]);
  return (
    <>
      <LoadingOverlay visible={isLoading} />
      <FileViewer url={url?.presignedUrl ?? ''} filename={data.fileName} />
    </>
  );
};
