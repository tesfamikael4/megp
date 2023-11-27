'use client';

import { Box, Button, FileInput, Group, Modal, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { Table, TableConfig } from '@megp/core-fe';
import { IconUpload } from '@tabler/icons-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export const Documents = () => {
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
      },
    ],
  };

  const onSubmit = (name) => {
    setData([name, ...data]);
    notifications.show({
      title: 'Success',
      message: 'Document Uploaded Success-fully',
      color: 'green',
    });
    close();
  };

  return (
    <Box className="pt-2">
      <Group justify="end" className="pb-2">
        <Button leftSection={<IconUpload size={18} />} onClick={open}>
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
