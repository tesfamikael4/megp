'use client';

import {
  useGetFilesQuery,
  useLazyDownloadFilesQuery,
} from '@/store/api/pre-budget-plan/pre-budget-plan.api';
import { LoadingOverlay, Menu, Modal } from '@mantine/core';
import { IconDotsVertical, IconDownload, IconEye } from '@tabler/icons-react';
import { useEffect } from 'react';
import { FileViewer } from '../../../_components/file-viewer';
import { useDisclosure } from '@mantine/hooks';
import { notify } from '@megp/core-fe';
import { ExpandableTable } from '../../../_components/expandable-table';

export const Document = ({ activityId }: any) => {
  const [dowloadFile, { isLoading: isDownloading }] =
    useLazyDownloadFilesQuery();
  const { data } = useGetFilesQuery(activityId);

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
  return (
    <ExpandableTable
      data={data?.items ?? []}
      config={config}
      total={data?.total ?? 0}
    />
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
