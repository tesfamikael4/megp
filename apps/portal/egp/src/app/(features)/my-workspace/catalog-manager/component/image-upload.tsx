'use client';

import {
  Box,
  Button,
  Card,
  FileInput,
  Group,
  Menu,
  Modal,
  Text,
  TextInput,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import { Section, logger, notify } from '@megp/core-fe';
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
  useUploadMutation,
  useDeleteFileMutation,
} from '../_api/catalog.api';
import { useParams } from 'next/navigation';
import { FileViewer } from '../../_components/file-viewer';

export const UploadImage = ({
  disableFields = false,
}: {
  disableFields?: boolean;
}) => {
  const [opened, { open, close }] = useDisclosure(false);
  const { id } = useParams();
  const [file, setFile] = useState<File[]>();
  const { register, handleSubmit, setValue } = useForm();
  const [retrieveNewPrURL] = useUploadMutation();

  const [deletePrFile, { isLoading: isPrDeleting }] = useDeleteFileMutation();

  const { data: PrDocuments } = useGetFilesQuery(id);

  const [dowloadPrFile, { isLoading: isPrDownloading }] =
    useLazyDownloadFilesQuery();

  const [isLoading, setIsLoading] = useState(false);
  const config = {
    columns: [
      {
        header: 'Name',
        accessor: 'title',
      },
      {
        accessor: 'action',
        header: 'Action',
        render: (record) => <Action data={record} />,
        width: 70,
      },
    ],
  };

  useEffect(() => {
    setValue('name', '');
  }, [opened]);

  const Action = ({ data }: any) => {
    const [opened, { open, close }] = useDisclosure(false);
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
        onConfirm: () => handleDelete(data.id),
      });
    };
    const handleDownload = async () => {
      try {
        const res = await dowloadPrFile(data.id).unwrap();
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
    const handleDelete = async (id) => {
      try {
        await deletePrFile(id).unwrap();

        notify('Success', 'Document deleted successfully');
      } catch (err) {
        logger.log(err);
        notify('Error', 'Something went wrong while deleting document');
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
              }}
            >
              View
            </Menu.Item>
            <Menu.Item
              leftSection={<IconDownload size={15} />}
              onClick={handleDownload}
              disabled={isPrDownloading}
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
          title={data.fileName}
          size="xl"
          pos="relative"
        >
          <FilePriview data={data} />
        </Modal>
      </>
    );
  };

  const onSubmit = async (document) => {
    try {
      setIsLoading(true);
      await upload(file as unknown as FileList, document.name);
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
        const url = await retrieveNewPrURL({
          fileInfo: {
            originalname: file.name,
            contentType: file.type,
          },
          procurementRequisitionId: id,
          title: name,
        }).unwrap();

        await uploadFile(file, url?.presignedUrl.presignedUrl);
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
    <Section
      title="Documents"
      collapsible={false}
      action={
        <Group justify="end">
          <Button
            leftSection={<IconUpload size={18} />}
            onClick={open}
            disabled={disableFields}
          >
            Upload
          </Button>
        </Group>
      }
    >
      <Box className="pt-2">
        <FileInput onClick={open} />
        {PrDocuments?.items.map((item) => {
          <Card>
            {item.fileInfo.originalname}

            <Menu shadow="md">
              <Menu.Target>
                <IconDotsVertical className="ml-auto text-gray-500" size={16} />
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
                  // onClick={handleDownload}
                  disabled={isPrDownloading}
                >
                  Download
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item color="red" leftSection={<IconTrash size={15} />}>
                  Delete
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Card>;
        })}
        <Modal
          title={<Box fw={'bold'}>Upload New Image</Box>}
          opened={opened}
          onClose={close}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextInput
              label="Name"
              {...register('name')}
              required
              withAsterisk
            />

            <FileInput
              accept=".png, .jpeg, .jpg"
              multiple
              label="Image"
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
    </Section>
  );
};

const FilePriview = ({ data }: { data: any }) => {
  const [dowloadPrFile, { data: prUrl, isLoading: isPrLoading }] =
    useLazyDownloadFilesQuery();

  useEffect(() => {
    dowloadPrFile(data.id);
  }, [data]);
  return (
    <>
      <FileViewer url={prUrl?.presignedUrl ?? ''} filename={data.fileName} />
    </>
  );
};
