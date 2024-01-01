import { LoadingOverlay, Stack, Button, TextInput, Text } from '@mantine/core';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Table, TableConfig } from '@megp/core-fe';
import { IconDeviceFloppy, IconPlus, IconX } from '@tabler/icons-react';
import { modals } from '@mantine/modals';

export function Steps() {
  const [data, setData] = useState<any>([]);
  const listConfig: TableConfig<any> = {
    columns: [
      {
        header: 'Name',
        accessorKey: 'name',
        cell: ({ row: { original } }) => <Steps original={original} />,
      },
      {
        header: '',
        accessorKey: 'action',
        cell: ({ row: { original } }: any) => <Action cell={original} />,
      },
    ],
  };

  const Action = ({ cell }: any) => {
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

    const handleDelete = () => {
      const temp = data.filter((item: any) => item.name !== cell.name);
      setData([...temp]);
    };

    return <IconX size={18} onClick={openDeleteModal} />;
  };

  const handleAdd = () => {
    setData([
      ...data,
      {
        name: '',
      },
    ]);
    setIsEditiorOpened(true);
  };

  const [isEditorOpened, setIsEditiorOpened] = useState(false);
  const Steps = ({ original }: any) => {
    const [name, setName] = useState<string>(original.name);

    const onBlur = () => {
      setIsEditiorOpened(false);
      const temp = data.map((item: any) => {
        if (item.name === original.name) {
          return {
            ...item,
            name,
          };
        }
        return item;
      });
      setData([...temp]);
    };

    return (
      <Stack>
        {isEditorOpened && (
          <TextInput
            onChange={(e) => {
              setName(e.target.value);
            }}
            value={name}
            onBlur={onBlur}
            required
            className="w-1/2"
          />
        )}
        {!isEditorOpened && (
          <Text onClick={() => setIsEditiorOpened(true)}>{original?.name}</Text>
        )}
      </Stack>
    );
  };

  return (
    <Stack pos="relative">
      <Button
        leftSection={<IconPlus size={18} />}
        className="ml-auto"
        onClick={handleAdd}
      >
        Add Steps
      </Button>
      <Table config={listConfig} data={data} />
      {data.length > 0 && (
        <Button
          className="ml-auto"
          leftSection={<IconDeviceFloppy size={18} />}
        >
          Save
        </Button>
      )}
    </Stack>
  );
}
