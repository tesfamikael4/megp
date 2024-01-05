'use client';

import {
  Box,
  Button,
  Flex,
  Group,
  Menu,
  Modal,
  NumberInput,
  Select,
  Text,
} from '@mantine/core';
import { Table, TableConfig, logger } from '@megp/core-fe';
import { useDisclosure } from '@mantine/hooks';
import {
  IconDeviceFloppy,
  IconDotsVertical,
  IconEye,
  IconPlus,
  IconTrash,
} from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useLazyReadQuery } from '../procurement-requisition/_api/procurement-requisition.api';
import { useParams } from 'next/navigation';
import { useLazyGetUnitOfMeasurementsQuery } from '@/store/api/administration/administration.api';
import { notifications } from '@mantine/notifications';
import {
  useDeleteMutation,
  useLazyListByIdQuery,
  useUpdateMutation,
  useCreateMutation,
} from '../_api/items.api';
import { modals } from '@mantine/modals';
import { DetailItem } from './deatil-item';
import ItemSelector from '@/app/(features)/_components/item-selector';
import DataImport from './data-import';
import { useLazyListByIdQuery as useLazyListPrActivityQuery } from '../_api/pr-activity.api';

export function Items() {
  const [opened, { open, close }] = useDisclosure(false);
  const [openedImportModal, { close: closeImportModal }] = useDisclosure(false);
  const [data, setData] = useState<any[]>([]);
  const [newItems, setNewItems] = useState<any[]>([]);
  // const [trigerItem, { data: itemDetail }] = useLazyReadQuery();
  const [trigerItems, { data: itemsList }] = useLazyListByIdQuery();

  const [addItems, { isLoading: isAddingItems }] = useCreateMutation();
  const [trigger, { data: assignedActivity }] = useLazyListPrActivityQuery();

  const [removeItem] = useDeleteMutation();
  const [updateItem] = useUpdateMutation();
  const { id } = useParams();

  useEffect(() => {
    trigger({
      id: id.toString(),
      collectionQuery: undefined,
    });
  }, [id, trigger]);
  const config: TableConfig<any> = {
    columns: [
      {
        id: 'itemCode',
        header: 'Code',
        accessorKey: 'itemCode',
      },
      {
        header: 'Description',
        accessorKey: 'description',
      },
      {
        id: 'unitPrice',
        header: () => <div className="text-right">Unit Price</div>,
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
        id: 'uomName',
        header: 'UoM',
        accessorKey: 'uomName',
      },

      {
        id: 'totalEstimatedAmount',
        header: 'Total Amount',
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
        id: 'itemCode',
        header: 'Code',
        accessorKey: 'itemCode',
      },
      {
        header: 'Description',
        accessorKey: 'description',
      },
      {
        id: 'unitPrice',
        header: () => <div className="text-right">Unit Price</div>,
        accessorKey: 'unitPrice',
        cell: ({ getValue, row, column }) => (
          <>
            <EstimatedPrice
              getValue={getValue}
              row={row}
              column={column}
              mode="update"
            />
          </>
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
        id: 'uomName',
        header: 'UoM',
        accessorKey: 'uomName',
      },

      {
        id: 'totalEstimatedAmount',
        header: () => <div className="text-right">Total Amount</div>,
        accessorKey: 'totalEstimatedAmount',
        cell: ({ row: { original } }: any) => (
          <p className="text-right">
            {(original?.unitPrice * original?.quantity).toLocaleString(
              'en-US',
              {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              },
            )}
          </p>
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
        await removeItem(cell.id).unwrap();
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

        <Modal
          opened={opened}
          onClose={close}
          title={cell.description}
          size="xl"
        >
          <DetailItem data={cell} />
        </Modal>
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
        await updateItem(data).unwrap();
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

    logger.log(assignedActivity);
    return (
      <>
        <Flex
          gap="sm"
          justify="end"
          onDoubleClick={() => setIsEditorOpened(true)}
        >
          {!isEditorOpened && (
            <>
              <Text>
                {original?.unitPrice?.toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Text>
            </>
          )}
          {isEditorOpened && (
            <NumberInput
              leftSection={'USD'}
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
    const [getUoM] = useLazyGetUnitOfMeasurementsQuery();

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
        {!isEditorOpened && (
          <>
            <Text onDoubleClick={() => setIsEditorOpened(true)}>
              {original?.quantity}
            </Text>
            {/* <Text>{original?.uomName}</Text> */}
          </>
        )}
        {isEditorOpened && (
          <>
            <NumberInput value={value} onChange={setValue} onBlur={onBlur} />
          </>
        )}
      </>
    );
  };

  const handelAddItem = (items) => {
    logger.log('items:', items);
    const castedData = items.map((item) => ({
      unitPrice: 0,
      currency: item?.currency,
      quantity: 0,
      uom: item.uOMId,
      uomName: item.uOMName,
      ['preBudgetPlanActivityId']: id,
      description: item.description,
      metaData: item,
      itemCode: item.itemCode,
      measurement: item.measurementId,
      classification: item.commodityCode,
    }));

    setNewItems([...castedData, ...newItems]);
  };

  const handelOnSave = async () => {
    try {
      await addItems(newItems).unwrap();
      notifications.show({
        title: 'Success',
        message: 'Items Created Success-fully',
        color: 'green',
      });
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
    trigerItems({ id: id.toString(), collectionQuery: undefined });
  }, [id, trigerItems]);

  useEffect(() => {
    setData([...(itemsList?.items ?? [])]);
  }, [itemsList?.items]);

  return (
    <Box>
      <Group justify="end" className="my-2" gap="md">
        <Button onClick={open}>
          <IconPlus size={18} /> Add
        </Button>
      </Group>
      {newItems.length !== 0 && (
        <>
          <Text className="text-lg" fw="500">
            New Items
          </Text>
          <Table config={config} data={newItems} />
          <Flex justify="end" className="my-2" gap="sm">
            <Button onClick={handelOnSave} loading={isAddingItems}>
              <IconDeviceFloppy /> Save
            </Button>
            <Button variant="outline" onClick={() => setNewItems([])}>
              Reset
            </Button>
          </Flex>
        </>
      )}
      {(data.length != 0 || newItems.length === 0) && (
        <>
          <Text className="text-lg" fw="500">
            Items List
          </Text>
          <Table config={listConfig} data={data} />
        </>
      )}
      <ItemSelector onDone={handelAddItem} opened={opened} close={close} />
      <Modal
        opened={openedImportModal}
        onClose={closeImportModal}
        title="Import Items"
      >
        <DataImport onDone={handelAddItem} />
        <Button
          className="mt-4 ml-auto"
          onClick={closeImportModal}
          // loading={isLoading}
        >
          Done
        </Button>
      </Modal>
    </Box>
  );
}
