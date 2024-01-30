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
import { logger, notify } from '@megp/core-fe';
import { useDisclosure } from '@mantine/hooks';
import {
  IconDeviceFloppy,
  IconFileImport,
  IconPlus,
  IconTrash,
} from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDeleteMutation, useUpdateMutation } from '../_api/items.api';
import {
  useLazyListByIdQuery,
  useCreateMutation,
} from '@/app/(features)/_api/items.api';
import { modals } from '@mantine/modals';
import ItemSelector from '@/app/(features)/_components/item-selector';
import DataImport from './data-import';
import { ExpandableTable } from './expandable-table';
import { ItemDetailForm } from './item-form-detail';
import { CollectionQuery } from '@megp/entity';

export function Items() {
  const [opened, { open, close }] = useDisclosure(false);
  const [
    openedImportModal,
    { close: closeImportModal, open: openImportModal },
  ] = useDisclosure(false);
  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [newItems, setNewItems] = useState<any[]>([]);

  const [addItems, { isLoading: isAddingItems }] = useCreateMutation();

  const [updateItem, { isLoading: isUpdating }] = useUpdateMutation();

  const route = useRouter();

  const [listById, { data: itemsList, isSuccess }] = useLazyListByIdQuery();

  const [remove] = useDeleteMutation();

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
        disable={record.annualProcurementPlanBudgetLineId !== null}
      />
    ),
  };
  const listConfig = {
    ...config,
    expandedRowContent: (record) => (
      <ItemDetailForm
        item={record}
        onSave={handleUpdate}
        isLoading={isUpdating}
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
            {record.annualProcurementPlanBudgetLineId === null && (
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
            )}
          </>
        ),
      },
    ],
  };

  const handleDelete = async (id) => {
    try {
      await remove(id).unwrap();
      notify('Success', 'Item Deleted Successfully');
    } catch (err) {
      notify('Error', 'Something went wrong');
    }
  };

  const handleUpdate = async (data, id) => {
    try {
      await updateItem({ ...data, id }).unwrap();
      notify('Success', 'Updated Successfully');
    } catch (err) {
      notify('Error', 'Something went wrong');
    }
  };

  const handelAddItem = (items) => {
    logger.log('items:', items);
    const castedData = items.map((item) => ({
      unitPrice: 0,
      currency: itemsList?.items[0]?.currency,
      quantity: 0,
      uoM: item.uOMId,
      description: item.description,
      procurementRequisitionId: id,
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
      await addItems(newItems).unwrap();
      route.push(`/procurement-requisition/${id}`);
      notify('Success', 'Items Created Success-fully');
      setNewItems([]);
    } catch (err) {
      logger.log(err);
      notify('Error', 'Something Went wrong');
    }
  };

  const onRequestChange = (request: CollectionQuery) => {
    listById({ id: id as string, collectionQuery: request });
  };

  useEffect(() => {
    if (isSuccess) {
      setData([...(itemsList?.items ?? [])]);
      setTotal(itemsList?.total ?? 0);
    }
  }, [isSuccess, itemsList?.items, itemsList?.total]);

  return (
    <Box>
      <Group justify="end" className="my-2" gap="md">
        <Button onClick={openImportModal}>
          <IconFileImport size={18} /> Import
        </Button>
        <Button onClick={open}>
          <IconPlus size={18} /> Add
        </Button>
      </Group>
      {newItems.length !== 0 && (
        <>
          <Text className="text-lg" fw="500">
            New Items
          </Text>
          <ExpandableTable config={addConfig} data={newItems} />

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
        <Button className="mt-4 ml-auto" onClick={closeImportModal}>
          Done
        </Button>
      </Modal>
    </Box>
  );
}
