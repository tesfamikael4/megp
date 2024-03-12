import { useLazyGetUsersQuery } from '@/store/api/iam/iam.api';
import { ActionIcon, Box, Button, Group, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Section, logger, notify } from '@megp/core-fe';
import { IconDeviceFloppy, IconTrash } from '@tabler/icons-react';
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
import { ExpandableTable } from '../../_components/expandable-table';
import { CollectionQuery } from '@megp/entity';

export const Requisitioner = ({
  page,
  disableFields = false,
}: {
  page: 'pre' | 'post';
  disableFields?: boolean;
}) => {
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
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
                disabled={disableFields}
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
  const addConfig = {
    isSearchable: true,
    selectedItems: selectedItems,
    setSelectedItems: setSelectedItems,
    primaryColumn: 'account.firstName',
    columns: [
      {
        title: 'Full Name',
        accessor: 'name',
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
  const { organizationId } = useAuth();

  const onCreate = async () => {
    const castedData = requisitioners.map((r: any) => ({
      ...r,
      [page == 'pre' ? 'preBudgetPlanActivityId' : 'postBudgetPlanActivityId']:
        id,
    }));

    try {
      if (page == 'pre') {
        await createPreRequisitioner({ requisitioner: castedData }).unwrap();
        notify('Success', 'Requisitioner Assigned Successfully');
      }
      if (page == 'post') {
        await createPostRequisitioner({ requisitioner: castedData }).unwrap();
        notify('Success', 'Requisitioner Assigned Successfully');
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

  useEffect(() => {
    setSelectedItems(requisitioners);
  }, [requisitioners]);
  return (
    <Section
      title="Requisitioners"
      collapsible={false}
      action={
        <Group justify="end">
          <Button disabled={disableFields} onClick={open}>
            Add
          </Button>
        </Group>
      }
    >
      <Box>
        <ExpandableTable
          data={requisitioners}
          config={config}
          total={requisitioners.length}
        />

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

        <Modal
          opened={opened}
          onClose={close}
          title="Add Requisitioner"
          size="lg"
        >
          <ExpandableTable
            config={addConfig}
            data={
              users
                ? users.items.map((user) => ({
                    name: user.firstName + ' ' + user.lastName,
                    id: user.id,
                  }))
                : []
            }
            total={users ? users.total : 0}
            onRequestChange={(collectionQuery) => {
              const id = organizationId ?? '';
              const castedCollectionQuery: CollectionQuery = {
                ...collectionQuery,
                include: 'account',
              };
              getUsers({ id, collectionQuery: castedCollectionQuery });
            }}
          />

          <Group justify="end">
            <Button
              onClick={() => {
                const castedData = selectedItems.map((r: any) => ({
                  name: r.name,
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
    </Section>
  );
};
