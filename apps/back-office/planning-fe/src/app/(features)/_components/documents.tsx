'use client';

import {
  Box,
  Button,
  FileInput,
  Group,
  Menu,
  Modal,
  Text,
  TextInput,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { Table, TableConfig, logger } from '@megp/core-fe';
import {
  IconDotsVertical,
  IconDownload,
  IconEye,
  IconTrash,
  IconUpload,
} from '@tabler/icons-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export const Documents = ({
  disableFields = false,
}: {
  disableFields?: boolean;
}) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [data, setData] = useState<any[]>([]);
  const { register, handleSubmit } = useForm();
  const config: TableConfig<any> = {
    columns: [
      {
        id: 'name',
        header: 'Name',
        accessorKey: 'name',
      },
      {
        id: 'action',
        header: 'Action',
        cell: ({ row: { original } }) => <Action cell={original} />,
      },
    ],
  };

  const Action = ({ cell }: any) => {
    const [opened, { open, close }] = useDisclosure(false);
    const openDeleteModal = () => {
      modals.openConfirmModal({
        title: `Delete ${cell.name}`,
        centered: true,
        children: (
          <Text size="sm">
            {`Are you sure you want to delete this ${cell.name} `}
          </Text>
        ),
        labels: { confirm: 'Yes', cancel: 'No' },
        confirmProps: { color: 'red' },
        onConfirm: handleDelete,
      });
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
            <Menu.Item leftSection={<IconEye size={15} />} onClick={open}>
              View
            </Menu.Item>
            <Menu.Item
              leftSection={<IconDownload size={15} />}
              onClick={() => {
                notifications.show({
                  title: 'Success',
                  message: `${cell.name} downloaded successfully`,
                  color: 'green',
                });
              }}
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
          title={cell.name}
          size="xl"
        ></Modal>
      </>
    );
  };

  const onSubmit = (name) => {
    setData([name, ...data]);
    notifications.show({
      title: 'Success',
      message: 'Document Uploaded Successfully',
      color: 'green',
    });
    close();
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
      <Table data={data} config={config} />

      <Modal title="Upload New Document" opened={opened} onClose={close}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextInput label="Name" {...register('name')} required withAsterisk />
          <FileInput
            label="Document"
            className="my-2"
            leftSection={<IconUpload />}
            withAsterisk
          />

          <Group gap="md" justify="end">
            <Button leftSection={<IconUpload size={18} />} type="submit">
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
