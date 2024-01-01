import {
  LoadingOverlay,
  Stack,
  Button,
  TextInput,
  Text,
  Modal,
  Checkbox,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import { useParams, usePathname } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Table, TableConfig, logger, notify } from '@megp/core-fe';
import {
  IconCross,
  IconDeviceFloppy,
  IconPlus,
  IconX,
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import { useGetPermissionsQuery } from '@/store/api/workflow/workflow-iam.api';
import { useAddPermissionsMutation } from '@/store/api/workflow/workflow.api';
import { useAuth } from '@megp/auth';
import { notifications } from '@mantine/notifications';

export function Permissions() {
  const [data, setData] = useState<any>([]);
  const { user } = useAuth();
  const { id } = useParams();
  const [opened, { open, close }] = useDisclosure(false);

  const [selected, setSelected] = useState<any>([]);

  const { data: permissions } = useGetPermissionsQuery({
    id: user?.organization?.id ?? '',
  });
  const [permissionsList, setPermissionList] = useState([]);
  const [addPermissions, { isLoading: isAddingPermissions }] =
    useAddPermissionsMutation();

  useEffect(() => {
    setPermissionList(permissions?.items);
  }, [permissions]);

  useEffect(() => {
    setSelected([]);
  }, []);

  // const permissions = [
  //   {
  //     name: 'Procurment Unit Head',
  //   },
  //   {
  //     name: 'Procurement Requisition',
  //   },
  //   {
  //     name: 'Procurement Approver',
  //   },
  // ];

  const listConfig: TableConfig<any> = {
    columns: [
      {
        header: 'Name',
        accessorKey: 'name',
      },
      {
        header: 'Action',
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

    return <IconX size={18} onClick={openDeleteModal} className="ml-auto" />;
  };

  const addConfig: TableConfig<any> = {
    columns: [
      {
        id: 'select',
        header: '',
        accessorKey: 'select',
        cell: ({ row: { original } }: any) => (
          <Checkbox
            checked={selected.some((item) => item.name === original.name)}
            onChange={(data) => {
              if (data.target.checked) setSelected([...selected, original]);
              else
                setSelected([...selected.filter((s) => s.id !== original.id)]);
            }}
          />
        ),
        meta: {
          widget: 'primary',
        },
      },
      {
        id: 'name',
        header: 'Permissions',
        accessorKey: 'name',
        cell: (info) => info.getValue(),
        meta: {
          widget: 'primary',
        },
      },
    ],
  };

  const onSave = async () => {
    try {
      const reformattedData = data.map((item, index) => {
        return {
          name: item.name,
          permissionId: item.id,
          activityId: id as string,
        };
      });
      await addPermissions(reformattedData).unwrap();
      notifications.show({
        title: 'Success',
        color: 'green',
        message: 'Steps saved succcessfully.',
      });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Error saving steps',
      });
    }
  };

  return (
    <Stack pos="relative">
      <Button
        leftSection={<IconPlus size={18} />}
        className="ml-auto"
        onClick={open}
      >
        Add Permission
      </Button>
      <Table config={listConfig} data={data} />
      {data?.length > 0 && (
        <Button
          leftSection={<IconDeviceFloppy size={18} />}
          className="ml-auto"
          onClick={async () => {
            await onSave();
          }}
          loading={isAddingPermissions}
        >
          Save
        </Button>
      )}
      <Modal
        opened={opened}
        onClose={close}
        size="xl"
        title="Choose Permissions"
      >
        <Stack>
          <Table config={addConfig} data={permissionsList ?? []} />
          <Button
            onClick={() => {
              const newData = [
                ...data,
                ...selected.filter(
                  (item) =>
                    !data.some(
                      (existingItem) => existingItem.name === item.name,
                    ),
                ),
              ];
              setData(newData);
              close();
              setSelected([]);
            }}
            className="ml-auto"
          >
            Add
          </Button>
        </Stack>
      </Modal>
    </Stack>
  );
}
