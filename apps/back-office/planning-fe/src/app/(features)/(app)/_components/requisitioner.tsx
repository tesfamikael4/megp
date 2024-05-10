import {
  useLazyGetUsersByPermissionQuery,
  useLazyGetUsersQuery,
} from '@/store/api/iam/iam.api';
import { ActionIcon, Box, Button, Group, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  ExpandableTable,
  ExpandableTableConfig,
  Section,
  logger,
  notify,
} from '@megp/core-fe';
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

import {
  useCreateRequisitionerMutation as useCreatePrRequisitionerMutation,
  useLazyGetRequisitionerQuery as useLazyGetPrRequisitionerQuery,
} from '@/store/api/pr/pr.api';
import { CollectionQuery } from '@megp/entity';

export const Requisitioner = ({
  page,
  disableFields = false,
}: {
  page: 'pre' | 'post' | 'pr';
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
  const addConfig: ExpandableTableConfig = {
    idAccessor: 'userId',
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
  const [getUsers, { data: users }] = useLazyGetUsersByPermissionQuery();
  const [getUsersForPr, { data: usersPr }] = useLazyGetUsersQuery();

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

  const [createPrRequisitioner, { isLoading: isPrCreatingLoading }] =
    useCreatePrRequisitionerMutation();

  const [
    getPrRequisitioner,
    { data: prRequisitioner, isSuccess: isPrRequisitionerSuccess },
  ] = useLazyGetPrRequisitionerQuery();

  const [requisitioners, setRequisitioners] = useState<any[]>([]);
  const { organizationId } = useAuth();

  const onCreate = async () => {
    const castedData = requisitioners.map((r: any) => ({
      ...r,
      [page == 'pre' ? 'preBudgetPlanActivityId' : 'postBudgetPlanActivityId']:
        id,
    }));
    if (castedData.length === 0) {
      notify('Error', 'Please select at least one requisitioner');
      return;
    }

    const castePrData = requisitioners.map((r: any) => r);

    try {
      if (page == 'pre') {
        await createPreRequisitioner({ requisitioner: castedData }).unwrap();
        notify('Success', 'Requisitioner Assigned Successfully');
      }
      if (page == 'post') {
        await createPostRequisitioner({ requisitioner: castedData }).unwrap();
        notify('Success', 'Requisitioner Assigned Successfully');
      }
      if (page == 'pr') {
        await createPrRequisitioner({
          procurementRequisitionId: id.toString(),
          officers: castePrData,
        }).unwrap();
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
    if (page == 'pr') {
      getPrRequisitioner(id as string);
    }
  }, [page]);

  useEffect(() => {
    if (page == 'pre' && isPreRequisitionerSuccess) {
      setRequisitioners([...preRequisitioner.items]);
    }
    if (page == 'post' && isPostRequisitionerSuccess) {
      setRequisitioners([...postRequisitioner.items]);
    }
    if (page == 'pr' && isPrRequisitionerSuccess) {
      setRequisitioners([...prRequisitioner.items]);
    }
  }, [
    page,
    isPreRequisitionerSuccess,
    isPostRequisitionerSuccess,
    preRequisitioner,
    postRequisitioner,
    isPrRequisitionerSuccess,
    prRequisitioner,
  ]);
  logger.log(usersPr);

  useEffect(() => {
    const castedData = requisitioners?.map((r: any) => ({
      name: r.name,
      userId: r.userId,
    }));
    setSelectedItems(castedData ?? []);
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
            loading={
              isPreCreatingLoading ||
              isPostCreatingLoading ||
              isPrCreatingLoading
            }
          >
            <IconDeviceFloppy size={14} />
            Save
          </Button>
        </Group>

        <Modal
          opened={opened}
          onClose={close}
          title={<Box fw={'bold'}>Add Requisitioner</Box>}
          size="lg"
        >
          <ExpandableTable
            config={addConfig}
            data={
              users && page !== 'pr'
                ? users.items.map((user) => ({
                    name: user.firstName + ' ' + user.lastName,
                    userId: user.id,
                  }))
                : page === 'pr' && usersPr
                  ? usersPr.items.map((user) => ({
                      name: user.firstName + ' ' + user.lastName,
                      userId: user.id,
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
              {
                page !== 'pr'
                  ? getUsers({
                      organizationId: id,
                      collectionQuery: castedCollectionQuery,
                      permissionKey: 'planning:createProcurementRequisition',
                    })
                  : getUsersForPr({ id: id, collectionQuery: collectionQuery });
              }
            }}
          />

          <Group justify="end">
            <Button
              onClick={() => {
                setRequisitioners(selectedItems);
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
