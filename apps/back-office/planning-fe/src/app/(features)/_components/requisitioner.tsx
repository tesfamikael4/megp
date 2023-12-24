import { useLazyGetUsersQuery } from '@/store/api/iam/iam.api';
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
import {
  useCreatePreBudgetRequisitionerMutation,
  useLazyGetPreBudgetRequisitionerQuery,
} from '@/store/api/pre-budget-plan/pre-budget-plan.api';
import { useParams } from 'next/navigation';
import {
  useCreatePostBudgetRequisitionerMutation,
  useLazyGetPostBudgetRequisitionerQuery,
} from '@/store/api/post-budget-plan/post-budget-plan.api';

export const Requisitioner = ({
  page,
  disableFields = false,
}: {
  page: 'pre' | 'post';
  disableFields?: boolean;
}) => {
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
  const [createPreRequisitioner, { isLoading: isPreCreatingLoading }] =
    useCreatePreBudgetRequisitionerMutation();
  const [createPostRequisitioner, { isLoading: isPostCreatingLoading }] =
    useCreatePostBudgetRequisitionerMutation();
  const [
    getPreRequisitioner,
    { data: preRequisitioner, isSuccess: isPreRequisitionerSuccess },
  ] = useLazyGetPreBudgetRequisitionerQuery();
  const [
    getPostRequisitioner,
    { data: postRequisitioner, isSuccess: isPostRequisitionerSuccess },
  ] = useLazyGetPostBudgetRequisitionerQuery();
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
              disabled={disableFields}
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
      [page == 'pre' ? 'preBudgetPlanActivityId' : 'postBudgetPlanActivityId']:
        id,
    }));

    try {
      if (page == 'pre') {
        await createPreRequisitioner({ requisitioner: castedData }).unwrap();
        notify('Success', 'Requisitioner Added successfully');
      }
      if (page == 'post') {
        await createPostRequisitioner({ requisitioner: castedData }).unwrap();
        notify('Success', 'Requisitioner Added successfully');
      }
    } catch (err) {
      logger.log({ err });
      notify('Error', 'Something went wrong');
    }
  };

  useEffect(() => {
    if (page == 'pre') {
      getPreRequisitioner(id as string);
    }
    if (page == 'post') {
      getPostRequisitioner(id as string);
    }
  }, [page]);

  useEffect(() => {
    if (page == 'pre' && isPreRequisitionerSuccess) {
      setRequisitioners([...preRequisitioner.items]);
    }
    if (page == 'post' && isPostRequisitionerSuccess) {
      setRequisitioners([...postRequisitioner.items]);
    }
  }, [
    page,
    isPreRequisitionerSuccess,
    isPostRequisitionerSuccess,
    preRequisitioner,
    postRequisitioner,
  ]);
  return (
    <Box>
      <Group justify="end" className="my-2">
        <Button disabled={disableFields} onClick={open}>
          Add
        </Button>
      </Group>

      <Table data={requisitioners} config={config} />
      {requisitioners.length !== 0 && (
        <Group justify="end" className="my-2">
          <Button
            disabled={disableFields}
            onClick={onCreate}
            loading={isPreCreatingLoading || isPostCreatingLoading}
          >
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
