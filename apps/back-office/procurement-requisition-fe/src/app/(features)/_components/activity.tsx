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
import { logger, notify } from '@megp/core-fe';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useLazyGetBudgetYearQuery } from '@/store/api/budget/budget-year.api';
import {
  useLazyListByIdQuery as useLazyGetActivitiesQuery,
  useReadQuery,
} from '../_api/activity.api';
import { useParams } from 'next/navigation';
import {
  useCreateMutation,
  useLazyListByIdQuery,
} from '@/app/(features)/_api/pr-activity.api';
import { ExpandableTable } from './expandable-table';

export function Activities() {
  const [opened, { open, close }] = useDisclosure(false);

  const [listById, { data: prActivity, isSuccess }] =
    useLazyGetActivitiesQuery();
  const [modifiedData, setModifiedData] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | any[]>([]);
  const [data, setData] = useState<any[]>([]);
  const [addActivity, { isLoading }] = useCreateMutation();
  const [filtered, setFiltered] = useState<any[]>([]);
  const [finalData, setFinalData] = useState<any[]>([]);
  const [trigger, { data: assignedActivity, isSuccess: assigned }] =
    useLazyListByIdQuery();
  const [isFilter, setIsFilter] = useState<boolean>(false);

  const { id } = useParams();
  const [triggerBudjet, { data: budget, isSuccess: budgetFeatched }] =
    useLazyGetBudgetYearQuery();

  logger.log(modifiedData);

  const config = {
    columns: [
      {
        title: '',
        accessor: 'actions',
        render: (record) => (
          <Box>
            <Radio
              checked={selected == record}
              onChange={() => {
                const update = record;
                setSelected(update);
                setData((prev) => {
                  return [record];
                });
              }}
            />
          </Box>
        ),
      },

      {
        title: '#Ref',
        accessor: 'procurementReferenceNumber',
        width: 100,
      },
      {
        title: 'Name',
        accessor: 'activityName',
        width: 100,
      },
      {
        title: 'Procurement type',
        accessor: 'procurementMechanisms.procurementType',
        render: (record) => (
          <Box>{record.procurementMechanisms.procurementType}</Box>
        ),
      },
      {
        title: 'Procurement method',
        accessor: 'procurementMechanisms.procurementMethod',
        render: (record) => (
          <Box>{record.procurementMechanisms.procurementMethod}</Box>
        ),
      },

      {
        title: 'Funding source',
        accessor: 'procurementMechanisms.fundingSource',
        render: (record) => (
          <Box>{record.procurementMechanisms.fundingSource}</Box>
        ),
      },
    ],
  };

  const ReadActivity = ({ record, entity }: { record: any; entity: any }) => {
    logger.log(record, entity);
    const { data: activity } = useReadQuery(
      record.annualProcurementPlanActivityId.toString(),
    );

    return (
      <>
        {entity === 'procurementReferenceNumber'
          ? activity?.procurementReferenceNumber
          : entity === 'activityName'
            ? activity?.activityName
            : ''}
      </>
    );
  };

  const filterconfig = {
    columns: [
      {
        title: '',
        accessor: 'actions',
        render: (record) => (
          <Box>
            <Checkbox
              checked={data.includes(record)}
              onChange={(d) => {
                if (d.target.checked) setData([...data, record]);
                else setData([...data.filter((s) => s.id !== record.id)]);
              }}
            />
          </Box>
        ),
      },
      {
        title: '#Ref',
        accessor: 'procurementReferenceNumber',
        width: 100,
      },
      {
        title: 'Name',
        accessor: 'activityName',
        width: 100,
      },
      {
        title: 'Procurement type',
        accessor: 'procurementMechanisms.procurementType',
        render: (record) => (
          <Box>{record.procurementMechanisms.procurementType}</Box>
        ),
      },
      {
        title: 'Procurement method',
        accessor: 'procurementMechanisms.procurementMethod',
        render: (record) => (
          <Box>{record.procurementMechanisms.procurementMethod}</Box>
        ),
      },

      {
        title: 'Funding source',
        accessor: 'procurementMechanisms.fundingSource',
        render: (record) => (
          <Box>{record.procurementMechanisms.fundingSource}</Box>
        ),
      },
    ],
  };

  const listConfig = {
    isSearchable: true,
    columns: [
      {
        accessor: 'procurementReferenceNumber',
        title: '#Ref',
        render: (record) => {
          return (
            <ReadActivity
              record={record}
              entity={'procurementReferenceNumber'}
            />
          );
        },
      },

      {
        accessor: 'activityName',
        title: 'Name',
        render: (record) => {
          return <ReadActivity record={record} entity={'activityName'} />;
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

      notify('Success', 'Activity added successfully');
    } catch (err) {
      notify('Error', 'Something Went wrong');
    }
  };

  useEffect(() => {
    if (isSuccess) {
      const mod = prActivity?.items.map((item) => {
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
      if (mod) {
        setModifiedData(mod);
      }
    }
  }, [isSuccess, prActivity]);

  useEffect(() => {
    if (opened) {
      triggerBudjet(undefined);
    }
  }, [opened, triggerBudjet]);

  useEffect(() => {
    if (opened && budgetFeatched) {
      listById({
        id: budget?.items?.[1]?.id?.toString(),
        collectionQuery: { includes: ['procurementMechanisms'] },
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
        <ExpandableTable
          config={listConfig}
          data={finalData ?? []}
          total={finalData.length}
        />
        <Button
          className="mt-4 mb-4"
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
        {!isFilter && (
          <ExpandableTable
            config={config}
            data={modifiedData ?? []}
            total={modifiedData?.length}
          />
        )}
        {isFilter && (
          <ExpandableTable
            config={filterconfig}
            data={filtered ?? []}
            total={filtered?.length}
          />
        )}
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
        </Group>
      </Modal>
    </Box>
  );
}
