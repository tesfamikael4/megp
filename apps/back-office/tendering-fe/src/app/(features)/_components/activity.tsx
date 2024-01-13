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
import { Table, TableConfig, notify } from '@megp/core-fe';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import {
  useLazyGetActivitiesQuery,
  useLazyGetBudgetYearQuery,
} from '@/store/api/budget/budget-year.api';
import { useParams, useRouter } from 'next/navigation';
import {
  useCreateMutation,
  useLazyListByIdQuery as useLazyListPrActivityQuery,
} from '../_api/pr-activity.api';
import GetActivity from './get-activity';

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
        id: 'fundingSource',
        header: 'Funding source',
        accessorKey: 'fundingSource',
        cell: (info) => info.getValue(),
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
        id: 'fundingSource',
        header: 'Funding source',
        accessorKey: 'fundingSource',
        cell: (info) => info.getValue(),
      },
    ],
  };

  const listConfig: TableConfig<any> = {
    columns: [
      {
        id: 'procurementReference',
        header: '#Ref',
        accessorKey: 'procurementReference',
        cell: (info) => (
          <GetActivity
            id={info.row.original.annualProcurementPlanActivityId}
            mode={'reference'}
          />
        ),
        meta: {
          widget: 'expand',
        },
      },
      {
        id: 'name',
        header: 'Name',
        accessorKey: 'name',
        cell: (info) => (
          <GetActivity
            id={info.row.original.annualProcurementPlanActivityId}
            mode={'name'}
          />
        ),
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
      notify('Success', 'Activity added successfully');
    } catch (err) {
      notify('Error', 'Something Went wrong');
    }
  };

  useEffect(() => {
    if (isSuccess) {
      const mod = prActivity.items.map((item) => {
        return {
          ...item,
          procurementMethod:
            item?.postProcurementMechanisms &&
            item?.postProcurementMechanisms[0]?.procurementMethod,

          procurementType:
            item?.postProcurementMechanisms &&
            item?.postProcurementMechanisms[0]?.procurementType,

          isOnline:
            item?.postProcurementMechanisms &&
            item?.postProcurementMechanisms[0]?.isOnline === true
              ? 'Online'
              : 'Offline',
          fundingSource:
            item?.postProcurementMechanisms &&
            item?.postProcurementMechanisms[0]?.fundingSource,
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
    const modifyActivity = data.map((activity) => {
      return {
        ...activity,
        annualProcurementPlanActivityId: activity?.id,
      };
    });

    setFinalData(modifyActivity);
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
