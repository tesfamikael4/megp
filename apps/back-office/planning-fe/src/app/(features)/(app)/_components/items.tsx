'use client';

import {
  ActionIcon,
  Box,
  Button,
  Flex,
  Group,
  Modal,
  NumberFormatter,
  Stack,
  Text,
} from '@mantine/core';
import { Section, logger, notify } from '@megp/core-fe';
import { useDisclosure } from '@mantine/hooks';
import {
  IconDeviceFloppy,
  IconFileImport,
  IconPlus,
  IconTrash,
} from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  useCreateMultipleItemsMutation,
  useLazyReadActivityQuery,
} from '@/store/api/pre-budget-plan/pre-budget-plan.api';
import {
  useCreateMultipleItemsMutation as usePostCreateMultipleItemsMutation,
  useLazyReadPostActivityQuery,
} from '@/store/api/post-budget-plan/post-budget-plan.api';
import { notifications } from '@mantine/notifications';
import {
  useDeleteMutation,
  useLazyListByIdQuery,
  useUpdateMutation,
} from '../../_api/items.api';
import {
  useDeleteMutation as useDeletePostMutation,
  useLazyListByIdQuery as useLazyListPostByIdQuery,
  useUpdateMutation as useUpdatePostMutation,
} from '../_api/post-items.api';
import { modals } from '@mantine/modals';
import ItemSelector from '@/app/(features)/(app)/_components/item-selector';
import DataImport from '../../_components/data-import';
import { CollectionQuery } from '@megp/entity';
import { ExpandableTable } from '../../_components/expandable-table';
import { ItemDetailForm } from './item-form-detail';

export function Items({
  page,
  disableFields = false,
}: {
  page: 'pre' | 'post';
  disableFields?: boolean;
}) {
  const [isUploadBtnDisabled, setIsUploadBtnDisabled] = useState<boolean>(true);
  const [opened, { open, close }] = useDisclosure(false);
  const [
    openedImportModal,
    { close: closeImportModal, open: openImportModal },
  ] = useDisclosure(false);
  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [newItems, setNewItems] = useState<any[]>([]);
  const [getPreActivity, { data: preActivity }] = useLazyReadActivityQuery();
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
  const [removePre, { isSuccess: isPreDeleted }] = useDeleteMutation();
  const [removePost, { isSuccess: isPostDeleted }] = useDeletePostMutation();
  const [updatePre, { isLoading: isPreUpdating, isSuccess: isPreUpdated }] =
    useUpdateMutation();
  const [updatePost, { isLoading: isPostUpdating, isSuccess: isPostUpdated }] =
    useUpdatePostMutation();

  const { id } = useParams();

  const config = {
    isExpandable: true,
    columns: [
      { accessor: 'description', title: 'Description' },
      {
        title: 'UoM',
        accessor: 'uomName',
        width: 150,
      },
      {
        accessor: 'quantity',
        width: 100,
      },
      {
        title: 'Unit Price',
        textAlign: 'center',
        accessor: 'unitPrice',
        width: 200,
        render: (record) => {
          return (
            <p>
              {parseFloat(record.unitPrice).toLocaleString('en-US', {
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
        width: 200,
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
                const temp = newItems.filter((i) => i.id != record.id);
                setNewItems(temp);
              }}
              disabled={disableFields}
            >
              <IconTrash size={14} />
            </ActionIcon>
          </>
        ),
      },
    ],
  };
  const listConfig = {
    ...config,
    expandedRowContent: (record) => (
      <ItemDetailForm
        isDisabled={disableFields}
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
                  title: `Delete Item`,
                  centered: true,
                  children: (
                    <Text size="sm">
                      {`Are you sure you want to delete this Item `}
                    </Text>
                  ),
                  labels: { confirm: 'Yes', cancel: 'No' },
                  confirmProps: { color: 'red' },
                  onConfirm: () => handleDelete(record.id),
                });
              }}
              disabled={disableFields}
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
      if (err.status === 430) {
        notifications.show({
          title: 'Error',
          message: err.data.message,
          color: 'red',
        });
      } else {
        notifications.show({
          title: 'Error',
          message: 'Something went wrong',
          color: 'red',
        });
      }
    }
  };

  const handelAddItem = (items) => {
    logger.log('items:', items);
    const castedData = items.map((item, index) => ({
      id: index,
      unitPrice: `${item.unitPrice ?? 0}`,
      currency: page == 'pre' ? preActivity?.currency : postActivity?.currency,
      quantity: `${item.quantity ?? 0}`,
      uom: item.uOMId,
      uomName: item.uOMName,
      [page == 'pre' ? 'preBudgetPlanActivityId' : 'postBudgetPlanActivityId']:
        id,
      description: item.description,
      metaData: item,
      itemCode: item.itemCode,
      measurement: item.measurementId,
      classification: `${item.commodityCode}`,
    }));

    setNewItems([...castedData, ...newItems]);
    setIsUploadBtnDisabled(false);
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
    const temp = newItems.filter((i) => i.quantity * i.unitPrice > 0);
    if (temp.length !== newItems.length) {
      notify(
        'Error',
        'Please ensure that both Unit Price and Quantity are non-zero.',
      );
    } else {
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
        } else {
          await addPostItems({ items: castedData }).unwrap();
        }
        notify('Success', 'Item Added successfully');
        onRequestChange({});
        setNewItems([]);
      } catch (err) {
        logger.log(err);
        if (err.status === 430) {
          notify('Error', err.data.message);
        } else {
          notify('Error', 'Something went wrong');
        }
      }
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
  }, [
    id,
    getPreActivity,
    isPreDeleted,
    isPreUpdated,
    page,
    getPostActivity,
    isPostDeleted,
    isPostUpdated,
  ]);

  useEffect(() => {
    if (page == 'pre' && isPreSuccess) {
      setData([...(preList?.items ?? [])]);
      setTotal(preList?.total ?? 0);
    }
    page == 'post' && isPostSuccess && setData([...(postList?.items ?? [])]);
  }, [isPreSuccess, preList, postList, isPostSuccess, page]);

  return (
    <Section
      title="Items"
      collapsible={false}
      action={
        <Group justify="end" gap="md">
          <Button onClick={openImportModal} disabled={disableFields}>
            <IconFileImport size={18} /> Import
          </Button>
          <Button onClick={open} disabled={disableFields}>
            <IconPlus size={18} /> Add
          </Button>
        </Group>
      }
    >
      <Flex direction="column" align="end">
        <Stack unstyled>
          <Group>
            <Text size="sm" fw={700}>
              Est Amount:
            </Text>

            <NumberFormatter
              value={
                page == 'pre'
                  ? preActivity?.estimatedAmount
                  : postActivity?.estimatedAmount
              }
              prefix={`${page == 'pre' ? preActivity?.currency : postActivity?.currency} `}
              thousandSeparator
            />
          </Group>
          <Group>
            <Text size="sm" fw={700}>
              Cal Amount:
            </Text>
            <NumberFormatter
              value={
                page == 'pre'
                  ? preActivity?.calculatedAmount
                  : postActivity?.calculatedAmount
              }
              prefix={`${page == 'pre' ? preActivity?.currency : postActivity?.currency} `}
              thousandSeparator
            />
          </Group>
        </Stack>
      </Flex>
      <Box>
        {newItems.length !== 0 && (
          <>
            <Text className="text-lg" fw="500">
              New Items
            </Text>
            <ExpandableTable
              config={addConfig}
              data={newItems}
              total={newItems.length}
            />
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
            disabled={isUploadBtnDisabled}
          >
            Done
          </Button>
        </Modal>
      </Box>
    </Section>
  );
}
