'use client';

import {
  Box,
  Button,
  Flex,
  Group,
  Menu,
  Modal,
  NumberInput,
  Text,
} from '@mantine/core';
import { Table, TableConfig, logger } from '@megp/core-fe';
import { useDisclosure } from '@mantine/hooks';
import {
  IconDeviceFloppy,
  IconDotsVertical,
  IconEye,
  IconFileImport,
  IconPlus,
  IconTrash,
} from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useLazyReadQuery } from '../_api/activities.api';
import { useLazyReadQuery as useLazyReadPostActivityQuery } from '../_api/post-activity.api';
import { useParams } from 'next/navigation';
import { useLazyGetUnitOfMeasurementsQuery } from '@/store/api/administration/administration.api';
import { useCreateMultipleItemsMutation } from '@/store/api/pre-budget-plan/pre-budget-plan.api';
import { useCreateMultipleItemsMutation as usePostCreateMultipleItemsMutation } from '@/store/api/post-budget-plan/post-budget-plan.api';
import { notifications } from '@mantine/notifications';
import {
  useDeleteMutation,
  useLazyListByIdQuery,
  useUpdateMutation,
} from '../_api/items.api';
import {
  useDeleteMutation as useDeletePostMutation,
  useLazyListByIdQuery as useLazyListPostByIdQuery,
  useUpdateMutation as useUpdatePostMutation,
} from '../_api/post-items.api';
import { modals } from '@mantine/modals';
import { DetailItem } from './deatil-item';
import ItemSelector from '@/app/(features)/_components/item-selector';
import DataImport from './data-import';
import { CollectionQuery } from '@megp/entity';

export function Items({
  page,
  disableFields = false,
}: {
  page: 'pre' | 'post';
  disableFields?: boolean;
}) {
  const [opened, { open, close }] = useDisclosure(false);
  const [openedImportModal, { close: closeImportModal }] = useDisclosure(false);
  //   { open: openImportModal, close: closeImportModal },
  // ] = useDisclosure(false);
  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [newItems, setNewItems] = useState<any[]>([]);
  const [getPreActivity, { data: preActivity }] = useLazyReadQuery();
  const [getPostActivity, { data: postActivity }] =
    useLazyReadPostActivityQuery();
  const [addPreItems, { isLoading: isPreAddingItems }] =
    useCreateMultipleItemsMutation();
  const [addPostItems, { isLoading: isPostAddingItems }] =
    usePostCreateMultipleItemsMutation();
  const [listPreById, { data: preList, isSuccess: isPreSuccess }] =
    useLazyListByIdQuery();
  const [listPostById, { data: postList, isSuccess: isPostSuccess }] =
    useLazyListPostByIdQuery();
  const [removePre] = useDeleteMutation();
  const [removePost] = useDeletePostMutation();
  const [updatePre] = useUpdateMutation();
  const [updatePost] = useUpdatePostMutation();
  const { id } = useParams();

  const config: TableConfig<any> = {
    columns: [
      {
        header: 'Description',
        accessorKey: 'description',
      },
      {
        id: 'uomName',
        header: 'UoM',
        accessorKey: 'uomName',
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
        id: 'unitPrice',
        header: () => <div className="text-end">Unit Price</div>,
        accessorKey: 'unitPrice',
        cell: ({ getValue, row, column }) => (
          <EstimatedPrice getValue={getValue} row={row} column={column} />
        ),
      },

      {
        id: 'totalEstimatedAmount',
        header: 'Total',
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
    pagination: true,
    primaryColumn: 'description',
    columns: [
      {
        header: 'Description',
        accessorKey: 'description',
      },
      {
        id: 'uomName',
        header: 'UoM',
        accessorKey: 'uomName',
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
        id: 'unitPrice',
        header: () => <div className="text-end">Unit Price</div>,
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
        id: 'totalEstimatedAmount',
        header: () => <div className="text-end">Total</div>,
        accessorKey: 'totalEstimatedAmount',
        cell: ({ row: { original } }: any) => (
          <p className="text-right">
            {(original.unitPrice * original.quantity).toLocaleString('en-US', {
              style: 'currency',
              currency: original?.currency,
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
              currencyDisplay: 'code',
            })}
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
        if (page == 'pre') {
          await removePre(cell.id).unwrap();
          notifications.show({
            title: 'Success',
            message: 'Item Deleted Successfully',
            color: 'green',
          });
        } else {
          await removePost(cell.id).unwrap();
          notifications.show({
            title: 'Success',
            message: 'Item Deleted Successfully',
            color: 'green',
          });
        }
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
              disabled={disableFields}
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
        if (page == 'pre') {
          await updatePre(data).unwrap();
          notifications.show({
            title: 'Success',
            message: 'Updated Successfully',
            color: 'green',
          });
        } else {
          await updatePost(data).unwrap();
          notifications.show({
            title: 'Success',
            message: 'Updated Successfully',
            color: 'green',
          });
        }
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
        <Flex
          gap="sm"
          justify="end"
          onDoubleClick={() => setIsEditorOpened(disableFields ? false : true)}
        >
          {!isEditorOpened && (
            <>
              <Text>
                {original?.unitPrice.toLocaleString('en-US', {
                  style: 'currency',
                  currency: original?.currency,
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                  currencyDisplay: 'code',
                })}
              </Text>
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
    const [getUoM] = useLazyGetUnitOfMeasurementsQuery();
    // const [getUoM, { data: uom }] = useLazyGetUnitOfMeasurementsQuery();

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
          <Text
            onDoubleClick={() =>
              setIsEditorOpened(disableFields ? false : true)
            }
          >
            {original?.quantity}
          </Text>
          // <Text>{original?.uomName}</Text>
        )}
        {isEditorOpened && (
          <NumberInput value={value} onChange={setValue} onBlur={onBlur} />
          // {/* <Select
          //   value={original.uom}
          //   data={uom?.items?.map((u) => ({
          //     value: u.id,
          //     label: u.name,
          //   }))}
          // /> */}
        )}
      </>
    );
  };

  const handelAddItem = (items) => {
    logger.log('items:', items);
    const castedData = items.map((item) => ({
      unitPrice: 0,
      currency: page == 'pre' ? preActivity?.currency : postActivity?.currency,
      quantity: 0,
      uom: item.uOMId,
      uomName: item.uOMName,
      [page == 'pre' ? 'preBudgetPlanActivityId' : 'postBudgetPlanActivityId']:
        id,
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
      if (page == 'pre') {
        await addPreItems({ items: newItems }).unwrap();
        notifications.show({
          title: 'Success',
          message: 'Items Created Successfully',
          color: 'green',
        });
      } else {
        await addPostItems({ items: newItems }).unwrap();
        notifications.show({
          title: 'Success',
          message: 'Items Created Successfully',
          color: 'green',
        });
      }
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

  const onRequestChange = (request: CollectionQuery) => {
    page == 'pre'
      ? listPreById({ id: id as string, collectionQuery: request })
      : listPostById({ id: id as string, collectionQuery: request });
  };

  //use effect
  useEffect(() => {
    page == 'pre'
      ? getPreActivity(id as string)
      : getPostActivity(id as string);
  }, [id, getPreActivity, page, getPostActivity]);

  useEffect(() => {
    if (page == 'pre' && isPreSuccess) {
      setData([...(preList?.items ?? [])]);
      setTotal(preList?.total ?? 0);
    }
    page == 'post' && isPostSuccess && setData([...(postList?.items ?? [])]);
  }, [isPreSuccess, preList, postList, isPostSuccess, page]);

  return (
    <Box>
      <Group justify="end" className="my-2" gap="md">
        {/* <Button onClick={openImportModal}>
          <IconFileImport size={18} /> Import
        </Button> */}
        <Button onClick={open} disabled={disableFields}>
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
            <Button
              onClick={handelOnSave}
              loading={isPreAddingItems || isPostAddingItems}
            >
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
          <Table
            config={listConfig}
            data={data}
            total={total}
            onRequestChange={onRequestChange}
          />
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
