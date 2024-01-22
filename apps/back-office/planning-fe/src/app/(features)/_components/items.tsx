'use client';

import {
  ActionIcon,
  Box,
  Button,
  Flex,
  Group,
  Modal,
  Text,
} from '@mantine/core';
import { logger } from '@megp/core-fe';
import { useDisclosure } from '@mantine/hooks';
import {
  IconDeviceFloppy,
  IconFileImport,
  IconPlus,
  IconTrash,
} from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useLazyReadQuery } from '../_api/activities.api';
import { useLazyReadQuery as useLazyReadPostActivityQuery } from '../_api/post-activity.api';
import { useParams } from 'next/navigation';
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
import ItemSelector from '@/app/(features)/_components/item-selector';
import DataImport from './data-import';
import { CollectionQuery } from '@megp/entity';
import { ExpandableTable } from './expandable-table';
import { ItemDetailForm } from './item-form-detail';

export function Items({
  page,
  disableFields = false,
}: {
  page: 'pre' | 'post';
  disableFields?: boolean;
}) {
  const [opened, { open, close }] = useDisclosure(false);
  const [
    openedImportModal,
    { close: closeImportModal, open: openImportModal },
  ] = useDisclosure(false);
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
  const [updatePre, { isLoading: isPreUpdating }] = useUpdateMutation();
  const [updatePost, { isLoading: isPostUpdating }] = useUpdatePostMutation();
  const { id } = useParams();

  const config = {
    isExpandable: true,
    columns: [
      { accessor: 'description', title: 'Description' },
      {
        title: 'UoM',
        accessor: 'uomName',
        width: 200,
      },
      {
        accessor: 'quantity',
        width: 100,
      },
      {
        title: 'Unit Price',
        textAlign: 'center',
        accessor: 'unitPrice',
        width: 100,
        render: (record) => {
          return (
            <p>
              {parseInt(record.unitPrice).toLocaleString('en-US', {
                style: 'currency',
                currency: record?.currency,
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
                currencyDisplay: 'code',
              })}
            </p>
          );
        },
      },

      {
        title: 'Total',
        accessor: 'total',
        textAlign: 'right',
        width: 150,
        render: (record) => (
          <p className="text-right">
            {(record.unitPrice * record.quantity).toLocaleString('en-US', {
              style: 'currency',
              currency: record?.currency,
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
              currencyDisplay: 'code',
            })}
          </p>
        ),
      },
    ],
  };

  const addConfig = {
    ...config,
    expandedRowContent: (record, collapse) => (
      <ItemDetailForm
        item={record}
        onDone={(data, id) => handelOnDone(data, id, collapse)}
      />
    ),
    // expandedRowContent: (record) => <ItemDetailForm item={record} />,
  };
  const listConfig = {
    ...config,
    expandedRowContent: (record) => (
      <ItemDetailForm
        item={record}
        onSave={handleUpdate}
        isLoading={isPreUpdating || isPostUpdating}
      />
    ),
    columns: [
      ...config.columns,
      {
        title: '',
        accessor: 'actions',
        width: 50,
        render: (record) => (
          <>
            <ActionIcon
              color="red"
              size="sm"
              variant="subtle"
              onClick={(e) => {
                e.stopPropagation();
                modals.openConfirmModal({
                  title: `Delete ${record.description}`,
                  centered: true,
                  children: (
                    <Text size="sm">
                      {`Are you sure you want to delete this ${record.description} `}
                    </Text>
                  ),
                  labels: { confirm: 'Yes', cancel: 'No' },
                  confirmProps: { color: 'red' },
                  onConfirm: () => handleDelete(record.id),
                });
              }}
            >
              <IconTrash size={14} />
            </ActionIcon>
          </>
        ),
      },
    ],
  };

  const handleDelete = async (id) => {
    try {
      if (page == 'pre') {
        await removePre(id).unwrap();
        notifications.show({
          title: 'Success',
          message: 'Item Deleted Successfully',
          color: 'green',
        });
      } else {
        await removePost(id).unwrap();
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

  const handleUpdate = async (data, id) => {
    try {
      if (page == 'pre') {
        await updatePre({ ...data, id }).unwrap();
        notifications.show({
          title: 'Success',
          message: 'Updated Successfully',
          color: 'green',
        });
      } else {
        await updatePost({ ...data, id }).unwrap();
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

  const handelAddItem = (items) => {
    logger.log('items:', items);
    const castedData = items.map((item, index) => ({
      id: index,
      unitPrice: item.unitPrice ?? 0,
      currency: page == 'pre' ? preActivity?.currency : postActivity?.currency,
      quantity: item.quantity ?? 0,
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

  const handelOnDone = (data, id, collapse) => {
    logger.log({ data });
    const castedData = newItems.map((item) => {
      if (item.id == id) {
        return { ...item, ...data };
      }
      return item;
    });

    setNewItems(castedData);
    collapse();
  };

  const handelOnSave = async () => {
    try {
      const castedData = newItems.map((item) => {
        return {
          unitPrice: item.unitPrice ?? 0,
          currency:
            page == 'pre' ? preActivity?.currency : postActivity?.currency,
          quantity: item.quantity ?? 0,
          uom: item.uom,
          uomName: item.uomName,
          [page == 'pre'
            ? 'preBudgetPlanActivityId'
            : 'postBudgetPlanActivityId']: id,
          description: item.description,
          metaData: item,
          itemCode: item.itemCode,
          measurement: item.measurement,
          classification: item.classification,
        };
      });
      if (page == 'pre') {
        await addPreItems({ items: castedData }).unwrap();
        notifications.show({
          title: 'Success',
          message: 'Items Created Successfully',
          color: 'green',
        });
      } else {
        await addPostItems({ items: castedData }).unwrap();
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
        <Button onClick={openImportModal} disabled={disableFields}>
          <IconFileImport size={18} /> Import
        </Button>
        <Button onClick={open} disabled={disableFields}>
          <IconPlus size={18} /> Add
        </Button>
      </Group>
      {newItems.length !== 0 && (
        <>
          <Text className="text-lg" fw="500">
            New Items
          </Text>
          <ExpandableTable config={addConfig} data={newItems} />
          {/* <Table config={config} data={newItems} /> */}
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

          <ExpandableTable
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
