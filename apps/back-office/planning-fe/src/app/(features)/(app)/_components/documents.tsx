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
  useDeleteDocumentMutation,
  useLazyGetFilesQuery as useLazyGetPreFilesQuery,
  useLazyDownloadFilesQuery,
  usePreSignedUrlMutation,
} from '@/store/api/pre-budget-plan/pre-budget-plan.api';
import {
  usePreSignedUrlMutation as usePostPreSignedUrlMutation,
  useDeleteDocumentMutation as usePostDeleteDocumentMutation,
  useLazyDownloadFilesQuery as useLazyDownloadPostFilesQuery,
  useLazyGetFilesQuery,
} from '@/store/api/post-budget-plan/post-budget-plan.api';

import {
  useLazyGetFilesQuery as useLazyGetPrFilesQuery,
  useLazyDownloadFilesQuery as useLazyDownloadPrFilesQuery,
  useUploadMutation as usePrUploadMutation,
  useDeleteFileMutation as useDeletePrFileMutation,
} from '@/store/api/budget/budget-year.api';
import { useParams } from 'next/navigation';
import { ExpandableTable } from '../../_components/expandable-table';
import { FileViewer } from '../../_components/file-viewer';

export const Documents = ({
  disableFields = false,
  page,
}: {
  page: 'pre' | 'post' | 'pr';
  disableFields?: boolean;
}) => {
  const [opened, { open, close }] = useDisclosure(false);
  const { id } = useParams();
  const [file, setFile] = useState<File[]>();
  const { register, handleSubmit, setValue } = useForm();
  const [retrieveNewURL] = usePreSignedUrlMutation();
  const [retrieveNewPostURL] = usePostPreSignedUrlMutation();
  const [retrieveNewPrURL] = usePrUploadMutation();

  const [deleteFile, { isLoading: isDeleting }] = useDeleteDocumentMutation();
  const [deletePostFile, { isLoading: isPostDeleting }] =
    usePostDeleteDocumentMutation();
  const [deletePrFile, { isLoading: isPrDeleting }] = useDeletePrFileMutation();

  const [getPreFiles, { data: documents }] = useLazyGetPreFilesQuery();
  const [getPrFiles, { data: PrDocuments }] = useLazyGetPrFilesQuery();
  const [getPostFiles, { data: postDocuments }] = useLazyGetFilesQuery();

  const [dowloadFile, { isLoading: isDownloading }] =
    useLazyDownloadFilesQuery();
  const [dowloadPostFile, { isLoading: isPostDownloading }] =
    useLazyDownloadPostFilesQuery();
  const [dowloadPrFile, { isLoading: isPrDownloading }] =
    useLazyDownloadPrFilesQuery();

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
        const res =
          page == 'pre'
            ? await dowloadFile(data.id).unwrap()
            : page == 'post'
              ? await dowloadPostFile(data.id).unwrap()
              : await dowloadPrFile(data.id).unwrap();
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
        if (page == 'pre') {
          await deleteFile(id).unwrap();
        } else if (page == 'post') {
          await deletePostFile(id).unwrap();
        } else {
          await deletePrFile(id).unwrap();
        }
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
                // handleViewer();
              }}
            >
              View
            </Menu.Item>
            <Menu.Item
              leftSection={<IconDownload size={15} />}
              onClick={handleDownload}
              disabled={isDownloading || isPostDownloading || isPrDownloading}
            >
              Download
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item
              color="red"
              leftSection={<IconTrash size={15} />}
              onClick={openDeleteModal}
              disabled={
                disableFields || isDeleting || isPostDeleting || isPrDeleting
              }
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
          <FilePriview data={data} page={page} />
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
        const url =
          page === 'pre'
            ? await retrieveNewURL({
                originalname: file.name,
                contentType: file.type,
                name: name,
                preBudgetPlanActivityId: id,
              }).unwrap()
            : page === 'post'
              ? await retrieveNewPostURL({
                  originalname: file.name,
                  contentType: file.type,
                  name: name,
                  postBudgetPlanActivityId: id,
                }).unwrap()
              : await retrieveNewPrURL({
                  fileInfo: {
                    originalname: file.name,
                    contentType: file.type,
                  },
                  procurementRequisitionId: id,
                  title: name,
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

  useEffect(() => {
    if (page == 'post') {
      getPostFiles(id as string);
    }
    if (page == 'pre') {
      getPreFiles(id as string);
    }
    if (page == 'pr') {
      getPrFiles(id as string);
    }
  }, []);

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
        <ExpandableTable
          data={
            page == 'pr'
              ? PrDocuments?.items ?? []
              : page == 'pre'
                ? documents?.items
                : postDocuments?.items ?? []
          }
          config={config}
          total={page == 'pr' ? PrDocuments?.total ?? 0 : documents?.total ?? 0}
        />

        <Modal
          title={<Box fw={'bold'}>Upload New Document</Box>}
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
              accept=".pdf"
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
    </Section>
  );
};

const FilePriview = ({
  data,
  page,
}: {
  data: any;
  page: 'pre' | 'post' | 'pr';
}) => {
  const [dowloadFile, { data: url, isLoading }] = useLazyDownloadFilesQuery();
  const [dowloadPostFile, { data: postUrl, isLoading: isPostLoading }] =
    useLazyDownloadPostFilesQuery();
  const [dowloadPrFile, { data: prUrl, isLoading: isPrLoading }] =
    useLazyDownloadPrFilesQuery();

  useEffect(() => {
    page == 'pre'
      ? dowloadFile(data.id)
      : page == 'post'
        ? dowloadPostFile(data.id)
        : dowloadPrFile(data.id);
  }, [data]);
  return (
    <>
      <LoadingOverlay visible={isLoading || isPostLoading || isPrLoading} />
      <FileViewer
        url={
          url?.presignedUrl ??
          postUrl?.presignedUrl ??
          prUrl?.presignedUrl ??
          ''
        }
        filename={data.fileName}
      />
    </>
  );
};
