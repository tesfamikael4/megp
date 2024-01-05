'use client';

import {
  Box,
  Button,
  Checkbox,
  Group,
  Modal,
  Radio,
  Text,
} from '@mantine/core';
import { Table, TableConfig, logger } from '@megp/core-fe';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import {
  useLazyGetActivitiesQuery,
  useLazyGetBudgetYearQuery,
} from '@/store/api/budget/budget-year.api';
import { notifications } from '@mantine/notifications';

import { useParams, useRouter } from 'next/navigation';
import {
  useCreateMutation,
  useLazyListByIdQuery as useLazyListPrActivityQuery,
} from '../_api/pr-activity.api';

export function Activities() {
  const [opened, { open, close }] = useDisclosure(false);

  const [listById, { data: prActivity, isSuccess }] =
    useLazyGetActivitiesQuery();
  const [modifiedData, setModifiedData] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | any[]>([]);
  const [data, setData] = useState<any[]>([]);
  const [addActivity, { isLoading, isSuccess: added }] = useCreateMutation();
  const [filtered, setFiltered] = useState<any[]>([]);
  const [finalData, setFinalData] = useState<any[]>([]);
  const [trigger, { data: assignedActivity, isSuccess: assigned }] =
    useLazyListPrActivityQuery();
  const [isFilter, setIsFilter] = useState<boolean>(false);

  const { id } = useParams();
  const [triggerBudjet, { data: budget, isSuccess: budgetFeatched }] =
    useLazyGetBudgetYearQuery();

  const router = useRouter();

  const config: TableConfig<any> = {
    columns: [
      {
        id: 'select',
        cell: ({ row }) => (
          <Box>
            <Radio
              checked={selected == row.original}
              onChange={() => {
                const update = row.original;
                setSelected(update);
                setData((prev) => {
                  return [row.original];
                });
              }}
            />
          </Box>
        ),
      },
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
      },
      {
        id: 'procurementType',
        header: 'Procurement type',
        accessorKey: 'procurementType',
        cell: (info) => info.getValue(),
      },
      {
        id: 'procurementMethod',
        header: 'Procurement method',
        accessorKey: 'procurementMethod',
        cell: (info) => info.getValue(),
      },
      {
        id: 'ProcurementProcess',
        header: 'Procurement Process',
        accessorKey: 'isOnline',
        cell: (info) => info.getValue(),
      },
      {
        id: 'fundingSource',
        header: 'Funding source',
        accessorKey: 'fundingSource',
        cell: (info) => info.getValue(),
      },

      {
        id: 'totalEstimatedAmount',
        header: () => <div className="text-right">Total Amount</div>,
        accessorKey: 'totalEstimatedAmount',
        cell: ({ row: { original } }) => (
          <p className="text-right">
            {original.estimatedAmount.toLocaleString('en-US', {
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
    ],
  };

  const filterconfig: TableConfig<any> = {
    columns: [
      {
        id: 'select',
        cell: ({ row }) => (
          <Box>
            <Checkbox
              checked={data.includes(row.original)}
              onChange={(d) => {
                if (d.target.checked) setData([...data, row.original]);
                else setData([...data.filter((s) => s.id !== row.original.id)]);
              }}
            />
          </Box>
        ),
      },
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
      },
      {
        id: 'procurementType',
        header: 'Procurement type',
        accessorKey: 'procurementType',
        cell: (info) => info.getValue(),
      },
      {
        id: 'procurementMethod',
        header: 'Procurement method',
        accessorKey: 'procurementMethod',
        cell: (info) => info.getValue(),
      },
      {
        id: 'ProcurementProcess',
        header: 'Procurement Process',
        accessorKey: 'isOnline',
        cell: (info) => info.getValue(),
      },
      {
        id: 'fundingSource',
        header: 'Funding source',
        accessorKey: 'fundingSource',
        cell: (info) => info.getValue(),
      },

      {
        id: 'totalEstimatedAmount',
        header: () => <div className="text-right">Total Amount</div>,
        accessorKey: 'totalEstimatedAmount',
        cell: ({ row: { original } }) => (
          <p className="text-right">
            {original.estimatedAmount.toLocaleString('en-US', {
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
    ],
  };

  const listConfig: TableConfig<any> = {
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
    ],
  };

  const handleSave = async () => {
    try {
      await addActivity({
        procurementRequisitionId: id?.toString(),
        annualProcurementPlanActivity: [`${selected.id}`],
      }).unwrap();

      added && router.push(`/procurement-requisition/${id}`);
      notifications.show({
        title: 'Success',
        message: 'Activity added successfully',
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

  useEffect(() => {
    if (isSuccess) {
      const mod = prActivity.items.map((item) => {
        logger.log(item);
        return {
          ...item,
          procurementMethod: item?.methods
            ? item?.methods[0]?.procurementMethod
            : 'National Competitive Bidding (NCB)',
          procurementType: item?.methods
            ? item?.methods[0]?.procurementType
            : 'Works',
          isOnline: item?.methods
            ? item?.methods[0]?.isOnline === true
              ? 'Online'
              : 'Offline'
            : 'Offline',
          fundingSource: item?.methods
            ? item?.methods[0]?.fundingSource
            : 'Treasury',
        };
      });
      setModifiedData(mod);
    }
  }, [isSuccess, prActivity]);

  useEffect(() => {
    if (opened) {
      triggerBudjet(undefined);
    }
  }, [opened, triggerBudjet]);

  useEffect(() => {
    if (opened) {
      listById({
        id: budget?.items?.budgetYearId.toString(),
        collectionQuery: undefined,
      });
    }
  }, [budget, budgetFeatched, listById, opened]);

  useEffect(() => {
    trigger({
      id: id.toString(),
      collectionQuery: undefined,
    });
  }, [id, trigger]);

  useEffect(() => {
    if (assigned && assignedActivity) {
      setFinalData(assignedActivity.items);
    }
  }, [assigned, assignedActivity]);

  const handleDone = () => {
    close();
    setFinalData(data);
  };
  return (
    <Box>
      <Group justify="end" className="my-2" gap="md">
        <Button onClick={open}>
          <IconPlus size={18} /> Add
        </Button>
      </Group>

      <>
        <Text className="text-lg" fw="500">
          Activity List
        </Text>
        <Table config={listConfig} data={finalData ?? []} />
        <Button
          className="mt-4"
          onClick={() => handleSave()}
          loading={isLoading}
        >
          Save
        </Button>
      </>

      <Modal
        opened={opened}
        onClose={close}
        title={isFilter ? 'Select related activity' : 'Select leading activity'}
        size={'xl'}
      >
        {!isFilter && <Table config={config} data={modifiedData ?? []} />}
        {isFilter && <Table config={filterconfig} data={filtered ?? []} />}
        <Group className="flex justify-end mt-4 mr-2">
          <Button
            className=" ml-auto"
            onClick={
              isFilter
                ? handleDone
                : () => {
                    selected &&
                      setFiltered(() => {
                        const filteredObjects = modifiedData.filter(
                          (obj) =>
                            obj.procurementMethod ===
                            selected.procurementMethod,
                        );

                        return filteredObjects;
                      });
                    setIsFilter(true);
                  }
            }
          >
            Done
          </Button>
          {isFilter && (
            <Button
              className='className="mr-2'
              onClick={() => setIsFilter(false)}
            >
              Back
            </Button>
          )}
        </Group>
      </Modal>
    </Box>
  );
}
