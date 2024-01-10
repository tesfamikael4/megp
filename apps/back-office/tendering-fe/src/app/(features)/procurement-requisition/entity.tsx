'use client';
import { ProcurementRequisition } from '@/models/procurement-requsition';
import { CollectionQuery, EntityConfig, EntityLayout } from '@megp/entity';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import {
  useDeleteMutation,
  useLazyListQuery,
} from './_api/procurement-requisition.api';
import { Button, Group, Menu, Modal, Text } from '@mantine/core';
import {
  IconDotsVertical,
  IconEye,
  IconPencil,
  IconTrash,
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import { DetailPr } from '../_components/detail-requisition';
import { notify } from '@megp/core-fe';

export function Entity({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const pathname = usePathname();

  const [remove] = useDeleteMutation();

  const [trigger, { data, isFetching }] = useLazyListQuery();

  const config: EntityConfig<ProcurementRequisition> = useMemo(() => {
    return {
      basePath: `/procurement-requisition`,
      mode: 'list',
      entity: 'procurement-requisition',
      primaryKey: 'id',
      title: 'Procurement requisition',
      onAdd: () => {
        router.push(`procurement-requisition/new`);
      },
      hasDetail: false,
      searchable: true,
      pagination: true,
      sortable: true,

      columns: [
        {
          id: 'requisitionReferenceNumber',
          header: 'Reference Number',
          accessorKey: 'requisitionReferenceNumber',
          cell: (info) => info.getValue(),
        },
        {
          id: 'name',
          header: 'Title',
          accessorKey: 'title',
          cell: (info) => info.getValue(),
          meta: {
            widget: 'primary',
          },
        },
        {
          id: 'description',
          header: 'Description',
          accessorKey: 'description',
          cell: (info) => info.getValue(),
        },
        {
          id: 'totalEstimatedAmount',
          header: () => <div className="w-full text-right">Total Amount</div>,
          accessorKey: 'totalEstimatedAmount',
          cell: ({ row: { original } }) => (
            <p className="text-right">
              {original.totalEstimatedAmount.toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
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
          header: () => <div className="w-full text-end">Actions</div>,
          accessorKey: 'action',
          cell: ({ row: { original } }: any) => <Action cell={original} />,
        },
      ],
    };
  }, [router]);

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
        notify('Success', 'Procurement requisition Deleted Success-fully');
        router.push(`procurement-requisition`);
      } catch (err) {
        notify('Error', 'Something went wrong');
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
              onClick={() => router.push(`/procurement-requisition/${cell.id}`)}
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
          <DetailPr cell={cell} />
          <Group justify="end" className="mt-2">
            <Button onClick={close}>Close</Button>
          </Group>
        </Modal>
      </>
    );
  };

  const mode =
    pathname === `/procurement-requisition`
      ? 'list'
      : pathname === `/procurement-requisition/new`
      ? 'new'
      : 'detail';

  const onRequestChange = (request: CollectionQuery) => {
    trigger(request);
  };

  return (
    <EntityLayout
      mode={mode}
      config={config}
      data={data?.items ?? []}
      total={data?.total ?? 0}
      detail={children}
      isLoading={isFetching}
      onRequestChange={onRequestChange}
    />
  );
}
