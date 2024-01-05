import { useLazyListByIdQuery as useLazyGetUsersQuery } from '@/app/(features)/_api/user.api';
import { Box, Button, Group, Menu, Modal, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import { Table, TableConfig, logger, notify } from '@megp/core-fe';
import {
  IconDeviceFloppy,
  IconDotsVertical,
  IconTrash,
} from '@tabler/icons-react';
import { CollectionSelector } from './collection-selector';
import { useAuth } from '@megp/auth';
import { useEffect, useState } from 'react';

import { useParams } from 'next/navigation';
import {
  useCreateMutation,
  useLazyListByIdQuery,
} from '@/app/(features)/_api/requisitioner.api';

export const Requisitioner = () => {
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
        accessorKey: 'action',
        cell: ({ row: { original } }) => <Action cell={original} />,
      },
    ],
  };
  const addConfig: TableConfig<any> = {
    columns: [
      {
        id: 'name',
        header: 'Full Name',
        accessorKey: 'fullName',
      },
    ],
  };
  const { id } = useParams();
  const [opened, { open, close }] = useDisclosure(false);
  const [getUsers, { data: users }] = useLazyGetUsersQuery();
  const [createRequisitioner, { isLoading: isCreatingLoading }] =
    useCreateMutation();

  const [getRequisitioner, { data: requisitioner }] = useLazyListByIdQuery();

  const [requisitioners, setRequisitioners] = useState<any[]>([]);
  const { user } = useAuth();

  const Action = ({ cell }: any) => {
    const handelRemove = () => {
      const temp = requisitioners.filter((r) => r.userId != cell.userId);
      setRequisitioners([...temp]);
    };
    return (
      <>
        <Menu shadow="md">
          <Menu.Target>
            <IconDotsVertical className="ml-auto text-gray-500" size={16} />
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item
              color="red"
              leftSection={<IconTrash size={15} />}
              onClick={handelRemove}
            >
              Remove
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </>
    );
  };

  const onCreate = async () => {
    const castedData = requisitioners.map((r: any) => ({
      ...r,
      procurementRequisitionId: id,
    }));

    try {
      await createRequisitioner(castedData).unwrap();
      notify('Success', 'Requisitioner Added successfully');
    } catch (err) {
      logger.log({ err });
      notify('Error', 'Something went wrong');
    }
  };

  useEffect(() => {
    getRequisitioner({ id: id.toString(), collectionQuery: undefined });
  }, [getRequisitioner, id]);

  useEffect(() => {
    requisitioner && setRequisitioners([...requisitioner.items]);
  }, [requisitioner]);
  return (
    <Box>
      <Group justify="end" className="my-2">
        <Button onClick={open}>Add</Button>
      </Group>

      <Table data={requisitioners} config={config} />
      {requisitioners.length !== 0 && (
        <Group justify="end" className="my-2">
          <Button onClick={onCreate} loading={isCreatingLoading}>
            <IconDeviceFloppy size={14} />
            Save
          </Button>
        </Group>
      )}
      <Modal opened={opened} onClose={close} title="Add Users" size="lg">
        <CollectionSelector
          config={addConfig}
          data={users ? users.items : []}
          total={users ? users.total : 0}
          onDone={(data) => {
            const castedData = data.map((d) => ({
              name: d.fullName,
              userId: d.id,
            }));
            setRequisitioners(castedData);
            logger.log({ data });
            close();
          }}
          multiSelect
          onRequestChange={(collectionQuery) => {
            const id = user?.organization?.id ?? '';
            getUsers({ id, collectionQuery });
          }}
        />
      </Modal>
    </Box>
  );
};
