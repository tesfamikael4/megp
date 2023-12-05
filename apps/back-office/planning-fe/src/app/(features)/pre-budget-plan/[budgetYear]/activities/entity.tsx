'use client';
import { CollectionQuery, EntityConfig, EntityLayout } from '@megp/entity';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { Button, Group, Menu, Modal, Text } from '@mantine/core';
import {
  IconDotsVertical,
  IconEye,
  IconPencil,
  IconTrash,
} from '@tabler/icons-react';
import { BudgetPlanActivities } from '@/models/budget-plan-activities';
import { useDeleteMutation, useLazyListByIdQuery } from './_api/activities.api';
import { notifications } from '@mantine/notifications';
import { modals } from '@mantine/modals';
import { logger } from '@megp/core-fe';
import { useDisclosure } from '@mantine/hooks';
import { DetailActivity } from '@/app/(features)/_components/detail-activity';

export function Entity({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { budgetYear } = useParams();
  const [listById, { data: list }] = useLazyListByIdQuery();
  const [remove] = useDeleteMutation();

  const config: EntityConfig<any> = useMemo(() => {
    return {
      basePath: `/pre-budget-plan/${budgetYear}/activities`,
      mode: 'list',
      entity: 'activities',
      primaryKey: 'name',
      title: 'Activities',
      onAdd: () => {
        router.push(`/pre-budget-plan/${budgetYear}/activities/new`);
      },
      onDetail: (selected: BudgetPlanActivities) => {
        router.push(`/pre-budget-plan/${budgetYear}/activities/${selected.id}`);
      },

      selectable: true,
      hasDetail: false,
      searchable: true,
      pagination: true,
      columns: [
        {
          id: 'procurementReference',
          header: '#Ref',
          accessorKey: 'procurementReference',
          cell: (info) => info.getValue(),
          meta: {
            widget: 'expand',
          },
        },
        {
          id: 'name',
          header: 'Name',
          accessorKey: 'name',
          cell: (info) => info.getValue(),
          meta: {
            widget: 'primary',
          },
        },

        {
          id: 'procurementType',
          header: ' Type',
          accessorKey: 'procurementType',
          cell: (info) => info.getValue(),
          meta: {
            widget: 'expand',
          },
        },
        {
          id: 'procurementMethod',
          header: ' Method',
          accessorKey: 'procurementMethod',
          cell: (info) => info.getValue(),
          meta: {
            widget: 'expand',
          },
        },

        {
          id: 'totalEstimatedAmount',
          header: () => <div className="text-right">Total Amount</div>,
          accessorKey: 'totalEstimatedAmount',
          cell: ({ row: { original } }) => (
            <p className="text-right">
              {original.totalEstimatedAmount.toLocaleString('en-US', {
                style: 'currency',
                currency: original.currency,
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          ),
          meta: {
            widget: 'expand',
          },
        },
        {
          id: 'action',
          header: 'Actions',
          accessorKey: 'action',
          cell: ({ row: { original } }: any) => <Action cell={original} />,
        },
      ],
    };
  }, [router]);

  const pathname = usePathname();

  const mode =
    pathname === `/pre-budget-plan/${budgetYear}/activities`
      ? 'list'
      : pathname === `/pre-budget-plan/${budgetYear}/activities/new`
      ? 'new'
      : 'detail';

  const onRequestChange = (request: CollectionQuery) => {
    listById({ id: budgetYear as string, collectionQuery: request });
  };

  const Action = ({ cell }: any) => {
    const [opened, { open, close }] = useDisclosure(false);
    const openDeleteModal = () => {
      modals.openConfirmModal({
        title: `Delete ${cell.description}`,
        centered: true,
        children: (
          <Text size="sm">
            {`Are you sure you want to delete this ${cell.description} `}
          </Text>
        ),
        labels: { confirm: 'Yes', cancel: 'No' },
        confirmProps: { color: 'red' },
        onConfirm: handleDelete,
      });
    };
    const handleDelete = async () => {
      try {
        await remove(cell.id).unwrap();
        notifications.show({
          title: 'Success',
          message: 'Item Deleted Success-fully',
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
              Detail
            </Menu.Item>
            <Menu.Item
              leftSection={<IconPencil size={15} />}
              onClick={() =>
                router.push(
                  `/pre-budget-plan/${budgetYear}/activities/${cell.id}`,
                )
              }
            >
              Edit
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item
              color="red"
              leftSection={<IconTrash size={15} />}
              onClick={openDeleteModal}
            >
              Delete
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
        <Modal opened={opened} onClose={close} title={cell.name} size="xl">
          <DetailActivity cell={cell} />
          <Group justify="end" className="mt-2">
            <Button onClick={close}>Close</Button>
          </Group>
        </Modal>
      </>
    );
  };

  return (
    <EntityLayout
      total={list?.total ?? 0}
      mode={mode}
      config={config}
      data={list?.items ?? []}
      detail={children}
      onRequestChange={onRequestChange}
    />
  );
}
