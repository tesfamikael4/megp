'use client';

import {
  Box,
  Button,
  Group,
  LoadingOverlay,
  Modal,
  Radio,
  Text,
} from '@mantine/core';
import { notify } from '@megp/core-fe';
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
} from '@/app/(features)/procurement-requisition/_api/pr-activity.api';
import { useCreateMutation as useCreateMethodMutation } from '@/app/(features)/procurement-requisition/_api/mechanization.api';
import { ExpandableTable } from './expandable-table';

export function Activities() {
  const [opened, { open, close }] = useDisclosure(false);

  const [
    listById,
    { data: prActivity, isSuccess, isLoading: loadingActivity },
  ] = useLazyGetActivitiesQuery();
  const [modifiedData, setModifiedData] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | any[]>([]);
  const [data, setData] = useState<any[]>([]);
  const [addActivity, { isLoading }] = useCreateMutation();

  const [trigger, { data: assignedActivity, isSuccess: assigned }] =
    useLazyListByIdQuery();

  const [createMethod] = useCreateMethodMutation();
  const { id } = useParams();
  const [triggerBudjet, { data: budget, isSuccess: budgetFeatched }] =
    useLazyGetBudgetYearQuery();

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
          <Box>{record?.procurementMechanisms?.procurementType}</Box>
        ),
      },
      {
        title: 'Procurement method',
        accessor: 'procurementMechanisms.procurementMethod',
        render: (record) => (
          <Box>{record?.procurementMechanisms?.procurementMethod}</Box>
        ),
      },

      {
        title: 'Funding source',
        accessor: 'procurementMechanisms.fundingSource',
        render: (record) => (
          <Box>{record?.procurementMechanisms?.fundingSource}</Box>
        ),
      },
    ],
  };

  const ReadActivity = ({ record, entity }: { record: any; entity: any }) => {
    const { data: activity, isLoading } = useReadQuery(
      record.annualProcurementPlanActivityId?.toString(),
    );

    return (
      <>
        <Group pos={'relative'}>
          <LoadingOverlay visible={isLoading} />
          {entity === 'procurementReferenceNumber'
            ? activity?.procurementReferenceNumber
            : entity === 'activityName'
              ? activity?.activityName
              : entity === 'procurementType'
                ? activity?.procurementMechanisms.procurementType
                : entity === 'procurementMethod'
                  ? activity?.procurementMechanisms.procurementMethod
                  : entity === 'fundingSource'
                    ? activity?.procurementMechanisms.fundingSource
                    : ''}
        </Group>
      </>
    );
  };

  const listConfig = {
    isSearchable: true,
    isLoading: loadingActivity,
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
    const method = {
      procurementMethod: selected?.procurementMechanisms?.procurementMethod,
      procurementType: selected?.procurementMechanisms?.procurementType,
      fundingSource: selected?.procurementMechanisms?.fundingSource,
      isOnline: selected?.procurementMechanisms?.isOnline,
      targetGroup: selected?.procurementMechanisms?.targetGroup,
      procurementRequisitionId: id,
      donor: selected?.procurementMechanisms?.donor,
      contract: selected?.procurementMechanisms?.contract,
    };
    try {
      await addActivity({
        procurementRequisitionId: id?.toString(),
        annualProcurementPlanActivity: [`${selected.id}`],
      }).unwrap();
      await createMethod(method).unwrap();

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
      budget?.items[0]?.id !== undefined &&
        listById({
          id: budget?.items?.[1]?.id?.toString(),
          collectionQuery: {
            includes: ['procurementMechanisms'],
            where: [
              [
                {
                  column: 'status',
                  value: 'Assigned',
                  operator: '!=',
                },
              ],
            ],
          },
        });
    }
  }, [budget, budgetFeatched, listById, opened]);

  useEffect(() => {
    id !== undefined &&
      trigger({
        id: id.toString(),
        collectionQuery: undefined,
      });
  }, [id, trigger]);

  useEffect(() => {
    if (assigned && assignedActivity) {
      setModifiedData(assignedActivity.items);
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

    setModifiedData(modifyActivity);
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
          data={modifiedData ?? []}
          total={modifiedData.length}
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
        title={<Group className="font-bold"> Select Activity</Group>}
        size={'xl'}
      >
        <ExpandableTable
          config={config}
          data={prActivity?.items ?? []}
          total={prActivity?.total ?? 0}
        />

        <Group className="flex justify-end mt-4 mr-2">
          <Button className=" ml-auto" onClick={handleDone}>
            Done
          </Button>
        </Group>
      </Modal>
    </Box>
  );
}
