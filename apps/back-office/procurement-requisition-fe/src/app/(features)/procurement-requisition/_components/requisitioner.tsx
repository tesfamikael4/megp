import { useLazyListByIdQuery as useLazyGetUsersQuery } from '@/app/(features)/procurement-requisition/_api/user.api';
import { ActionIcon, Box, Button, Group, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notify } from '@megp/core-fe';
import { IconDeviceFloppy, IconTrash } from '@tabler/icons-react';
import { useAuth } from '@megp/auth';
import { useEffect, useState } from 'react';

import { useParams } from 'next/navigation';
import {
  useCreateMutation,
  useLazyListByIdQuery,
} from '@/app/(features)/procurement-requisition/_api/requisitioner.api';
import { ExpandableTable } from './expandable-table';

export const Requisitioner = () => {
  const { organizationId } = useAuth();
  const config = {
    columns: [
      {
        title: 'Name',
        accessor: 'name',
      },
      {
        title: 'Action',
        accessor: 'action',
        width: 100,
        render: (record) => {
          return (
            <>
              <ActionIcon
                size="sm"
                variant="subtle"
                color="red"
                onClick={() => {
                  const temp = requisitioners.filter(
                    (r) => r.userId != record.userId,
                  );
                  setRequisitioners([...temp]);
                }}
              >
                <IconTrash size={16} />
              </ActionIcon>
            </>
          );
        },
      },
    ],
  };
  const [selectedItems, setSelectedItems] = useState<any[]>([]);

  const addConfig = {
    isSearchable: true,
    selectedItems: selectedItems,
    setSelectedItems: setSelectedItems,
    columns: [
      {
        title: 'Full Name',
        accessor: 'fullName',
        render: (record) => {
          return <>{record.firstName + ' ' + record.lastName}</>;
        },
      },
    ],
  };
  const { id } = useParams();
  const [opened, { open, close }] = useDisclosure(false);
  const [getUsers, { data: users }] = useLazyGetUsersQuery();
  const [createRequisitioner, { isLoading: isCreatingLoading }] =
    useCreateMutation();

  const [getRequisitioner, { data: requisitioner, isSuccess }] =
    useLazyListByIdQuery();

  const [requisitioners, setRequisitioners] = useState<any[]>([]);

  const onCreate = async () => {
    const castedData = requisitioners.map((r: any) => ({
      ...r,
      procurementRequisitionId: id,
      name: r.name,
    }));

    try {
      await createRequisitioner(castedData).unwrap();
      notify('Success', 'Requisitioner Added successfully');
    } catch (err) {
      notify('Error', 'Something went wrong');
    }
  };

  useEffect(() => {
    getRequisitioner({ id: id.toString(), collectionQuery: undefined });
  }, [getRequisitioner, id]);

  useEffect(() => {
    isSuccess && requisitioner && setRequisitioners([...requisitioner.items]);
  }, [isSuccess, requisitioner]);
  const onRequestChange = (collectionQuery) => {
    getUsers({
      id: organizationId,
      collectionQuery: collectionQuery,
    });
  };

  return (
    <Box>
      <Group justify="end" className="my-2">
        <Button onClick={open}>Add</Button>
      </Group>

      <ExpandableTable
        data={requisitioners}
        config={config}
        total={requisitioners.length}
      />
      {requisitioners.length !== 0 && (
        <Group justify="end" className="my-2">
          <Button onClick={onCreate} loading={isCreatingLoading} mb={'sm'}>
            <IconDeviceFloppy size={14} />
            Save
          </Button>
        </Group>
      )}
      <Modal
        opened={opened}
        onClose={close}
        title="Add Requisitioner"
        size="lg"
      >
        <ExpandableTable
          config={addConfig}
          data={users?.items ?? []}
          total={users ? users.total : 0}
          onRequestChange={onRequestChange}
        />

        <Group justify="end">
          <Button
            onClick={() => {
              const castedData = selectedItems.map((r: any) => ({
                name: r.firstName + ' ' + r.lastName,
                userId: r.id,
              }));

              setRequisitioners(castedData);
              close();
            }}
          >
            Done
          </Button>
        </Group>
      </Modal>
    </Box>
  );
};
