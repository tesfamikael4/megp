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
  Image,
  Flex,
  LoadingOverlay,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import { Section, notify } from '@megp/core-fe';
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
  useDownloadFilesQuery,
} from '../_api/catalog.api';
import { useParams } from 'next/navigation';

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

  const { data: productDocuments } = useGetFilesQuery(id);

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
    const [openedViewModal, { open: openViewModal, close: closeViewModal }] =
      useDisclosure(false);
    const openDeleteModal = () => {
      modals.openConfirmModal({
        title: `Delete Image`,
        centered: true,
        children: (
          <Text size="sm">
            {`Are you sure you want to delete this Image? `}
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
        notify('Error', 'Something went wrong while deleting document');
      }
    };

    return (
      <>
        <Menu shadow="md">
          <Menu.Target>
            <IconDotsVertical
              className="ml-auto text-gray-500 cursor-pointer"
              size={16}
            />
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item
              leftSection={<IconEye size={15} />}
              onClick={openViewModal}
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
          opened={openedViewModal}
          onClose={closeViewModal}
          title={data.fileName}
          size="lg"
        >
          <Box className="flex justify-center align-middle">
            <FilePriview data={data} />
          </Box>
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
          productCatalogId: id,
          title: name,
        }).unwrap();

        await uploadFile(file, url?.presignedUrl);
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

  const handleClick = async (data) => {
    try {
      await deletePrFile(data?.id).unwrap();
      notify('Success', 'Image deleted successfully');
    } catch (err) {
      notify('Error', 'Something went wrong while deleting image');
    }
  };

  return (
    <Section
      title="Images"
      collapsible={false}
      action={
        <Group justify="end">
          <Button
            leftSection={<IconUpload size={18} />}
            onClick={open}
            disabled={disableFields || productDocuments?.total >= 3}
          >
            Upload
          </Button>
        </Group>
      }
    >
      <Box className="pt-2">
        {productDocuments?.items.map((item, index) => (
          <>
            <Card key={index}>
              <Flex>
                {item.fileInfo.originalname}{' '}
                <Group className="ml-auto">
                  <Action data={item} />
                </Group>
              </Flex>
            </Card>
          </>
        ))}

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
  const { data: url, isLoading: isLoading } = useDownloadFilesQuery(data?.id);
  // const [dataUrl, setDataUrl] = useState<string>();

  return (
    <Box className="w-1/2  " mih={'50vh'}>
      <LoadingOverlay visible={isLoading} />
      <Image src={url?.presignedUrl} />
    </Box>
  );
};
