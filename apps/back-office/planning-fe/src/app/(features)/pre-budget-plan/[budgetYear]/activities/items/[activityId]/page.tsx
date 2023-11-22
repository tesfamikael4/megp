'use client';

import {
  ActionIcon,
  Button,
  Flex,
  Group,
  Modal,
  NumberInput,
  Select,
  Text,
} from '@mantine/core';
import { Section, Table, TableConfig, logger } from '@megp/core-fe';
import ItemSelector from './_components/item-selector';
import { useDisclosure } from '@mantine/hooks';
import {
  IconChevronLeft,
  IconChevronRight,
  IconDeviceFloppy,
  IconPencil,
  IconPlus,
  IconTrash,
} from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useLazyReadQuery } from '../../(activities)/_api/activities.api';
import { useParams, useRouter } from 'next/navigation';
import { useLazyGetUnitOfMeasurementsQuery } from '@/store/api/administration/administration.api';
import { useCreateMultipleItemsMutation } from '@/store/api/pre-budget-plan/pre-budget-plan.api';
import { notifications } from '@mantine/notifications';
import {
  useDeleteMutation,
  useLazyListByAppIdQuery,
  useUpdateMutation,
} from './_api/items.api';
import { modals } from '@mantine/modals';

export default function Items() {
  const [opened, { open, close }] = useDisclosure(false);
  const [data, setData] = useState<any[]>([]);
  const [newItems, setNewItems] = useState<any[]>([]);
  const [getActivity, { data: activity }] = useLazyReadQuery();
  const [addItems, { isLoading: isAddingItems, isSuccess: isAdded }] =
    useCreateMultipleItemsMutation();
  const [listById, { data: list, isSuccess }] = useLazyListByAppIdQuery();
  const [remove] = useDeleteMutation();
  const [update] = useUpdateMutation();
  const { activityId, budgetYear } = useParams();
  const router = useRouter();
  const config: TableConfig<any> = {
    columns: [
      {
        header: 'Description',
        accessorKey: 'description',
      },
      {
        id: 'itemCode',
        header: 'Code',
        accessorKey: 'itemCode',
      },
      {
        id: 'unitPrice',
        header: 'Estimated Unit Price',
        accessorKey: 'unitPrice',
        cell: ({ getValue, row, column }) => (
          <EstimatedPrice getValue={getValue} row={row} column={column} />
        ),
      },
      {
        id: 'quantity',
        header: 'Quantity',
        accessorKey: 'quantity',
        cell: ({ getValue, row, column }) => (
          <Quantity getValue={getValue} row={row} column={column} />
        ),
      },

      {
        id: 'totalEstimatedAmount',
        header: 'Total Estimated Amount',
        accessorKey: 'totalEstimatedAmount',
        cell: ({ row: { original } }: any) => (
          <>
            {original.currency} {original.unitPrice * original.quantity}
          </>
        ),
      },
    ],
  };
  const listConfig: TableConfig<any> = {
    columns: [
      {
        header: 'Description',
        accessorKey: 'description',
      },
      {
        id: 'itemCode',
        header: 'Code',
        accessorKey: 'itemCode',
      },
      {
        id: 'unitPrice',
        header: 'Estimated Unit Price',
        accessorKey: 'unitPrice',
        cell: ({ getValue, row, column }) => (
          <EstimatedPrice
            getValue={getValue}
            row={row}
            column={column}
            mode="update"
          />
        ),
      },
      {
        id: 'quantity',
        header: 'Quantity',
        accessorKey: 'quantity',
        cell: ({ getValue, row, column }) => (
          <Quantity getValue={getValue} row={row} column={column} />
        ),
      },

      {
        id: 'totalEstimatedAmount',
        header: 'Total Estimated Amount',
        accessorKey: 'totalEstimatedAmount',
        cell: ({ row: { original } }: any) => (
          <>
            {original.currency} {original.unitPrice * original.quantity}
          </>
        ),
      },
      {
        id: 'action',
        header: 'Action',
        accessorKey: 'totalEstimatedAmount',
        cell: ({ row: { original } }: any) => <Action cell={original} />,
      },
    ],
  };

  const Action = ({ cell }: any) => {
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
        <Group justify="end">
          <ActionIcon color="red" onClick={openDeleteModal}>
            <IconTrash />
          </ActionIcon>

          <ActionIcon
            variant="outline"
            onClick={() =>
              router.push(
                `/pre-budget-plan/${budgetYear}/activities/items/${activityId}/${cell.id}`,
              )
            }
          >
            <IconChevronRight />
          </ActionIcon>
        </Group>
      </>
    );
  };

  const EstimatedPrice = ({
    getValue,
    row: { index, original },
    column: { id },
    mode = 'new',
  }: any) => {
    const [isEditorOpened, setIsEditorOpened] = useState(false);
    const initialValue = getValue();
    const [value, setValue] = useState(initialValue);

    const updateData = async (data) => {
      try {
        await update(data).unwrap();
        notifications.show({
          title: 'Success',
          message: 'Updated Success-fully',
          color: 'green',
        });
      } catch (err) {
        notifications.show({
          title: 'Error',
          message: 'Something went wrong',
          color: 'red',
        });
      }
    };

    const onBlur = () => {
      setIsEditorOpened(false);

      mode == 'new'
        ? setNewItems((old) =>
            old.map((row, i) => {
              if (i === index) {
                return {
                  ...old[index],
                  [id]: value,
                };
              }
              return row;
            }),
          )
        : setData((old) =>
            old.map((row, i) => {
              if (i === index) {
                updateData({ ...old[index], [id]: value });
                return {
                  ...old[index],
                  [id]: value,
                };
              }
              return row;
            }),
          );
    };
    useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);
    return (
      <>
        <Flex gap="sm">
          {!isEditorOpened && (
            <>
              <Text>{original?.currency}</Text>
              <Text>{original?.unitPrice}</Text>
              <IconPencil
                onClick={() => setIsEditorOpened(true)}
                className="ml-auto"
              />
            </>
          )}
          {isEditorOpened && (
            <NumberInput
              leftSection={original.currency}
              value={value}
              onChange={setValue}
              onBlur={onBlur}
            />
          )}
        </Flex>
      </>
    );
  };
  const Quantity = ({
    getValue,
    row: { index, original },
    column: { id },
  }: any) => {
    const [isEditorOpened, setIsEditorOpened] = useState(false);
    const initialValue = getValue();
    const [value, setValue] = useState(initialValue);
    const [getUoM, { data: uom }] = useLazyGetUnitOfMeasurementsQuery();

    const onBlur = () => {
      setIsEditorOpened(false);

      setNewItems((old) =>
        old.map((row, i) => {
          if (i === index) {
            return {
              ...old[index],
              [id]: value,
            };
          }
          return row;
        }),
      );
    };
    useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);
    useEffect(() => {
      isEditorOpened && getUoM(original.measurement);
    }, [isEditorOpened]);
    return (
      <>
        <Flex gap="sm">
          {!isEditorOpened && (
            <>
              <Text>{original?.quantity}</Text>
              <Text>{original?.uomName}</Text>
              <IconPencil
                onClick={() => setIsEditorOpened(true)}
                className="ml-auto"
              />
            </>
          )}
          {isEditorOpened && (
            <>
              <NumberInput value={value} onChange={setValue} onBlur={onBlur} />
              <Select
                value={original.uom}
                data={uom?.items?.map((u) => ({
                  value: u.id,
                  label: u.name,
                }))}
              />
            </>
          )}
        </Flex>
      </>
    );
  };

  const handelAddItem = (items) => {
    logger.log('items:', items);
    const castedData = items.map((item) => ({
      unitPrice: 0,
      currency: activity?.currency,
      quantity: 0,
      uom: item.uOMId,
      uomName: item.uOMName,
      preBudgetPlanActivityId: activityId,
      description: item.description,
      metaData: item,
      itemCode: item.itemCode,
      measurement: item.measurementId,
    }));

    setNewItems([...castedData, ...newItems]);
  };

  const handelOnSave = async () => {
    try {
      await addItems({ items: newItems }).unwrap();
      notifications.show({
        title: 'Success',
        message: 'Items Created Success-fully',
        color: 'green',
      });
      setNewItems([]);
    } catch (err) {
      logger.log(err);
      notifications.show({
        title: 'Error',
        message: 'Something Went wrong',
        color: 'red',
      });
    }
  };

  //use effect
  useEffect(() => {
    getActivity(activityId as string);
  }, [activityId, getActivity]);

  useEffect(() => {
    listById(activityId as string);
  }, [activityId, isAdded]);

  useEffect(() => {
    isSuccess && setData([...(list?.items ?? [])]);
  }, [list, isSuccess]);

  return (
    <Section
      title={
        <Flex gap="sm">
          <Button
            variant="outline"
            leftSection={<IconChevronLeft size={18} />}
            onClick={() =>
              router.push(`/pre-budget-plan/${budgetYear}/activities/`)
            }
          >
            Activities
          </Button>
          <Text fw="500" className="text-lg">
            Items : {activity?.name ?? ''}
          </Text>
        </Flex>
      }
      collapsible={false}
      action={
        <Button onClick={open}>
          <IconPlus size={18} /> Add
        </Button>
      }
    >
      {newItems.length !== 0 && (
        <>
          <Text className="text-lg" fw="500">
            New Added Items
          </Text>
          <Table config={config} data={newItems} />
          <Flex justify="end" className="my-2" gap="sm">
            <Button onClick={handelOnSave} loading={isAddingItems}>
              <IconDeviceFloppy /> Save
            </Button>
            <Button variant="outline">Clean</Button>
          </Flex>
        </>
      )}
      {(data.length != 0 || newItems.length === 0) && (
        <Table config={listConfig} data={data} />
      )}
      <ItemSelector onDone={handelAddItem} opened={opened} close={close} />
    </Section>
  );
}
