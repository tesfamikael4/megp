'use client';

import { Box, Button, Group, NumberInput, TextInput } from '@mantine/core';
import { Table, TableConfig, logger, notify } from '@megp/core-fe';
import { useEffect, useState } from 'react';
import { DateInput } from '@mantine/dates';
import { IconDeviceFloppy } from '@tabler/icons-react';
import { useReadQuery } from '../_api/procurement-requisition.api';
import { useParams } from 'next/navigation';
import {
  useCreatePrTimelineMutation,
  useLazyGetPrTimelineQuery,
} from '@/store/api/pr/pr.api';

const tableData = [
  {
    timeline: 'Procurement Initiation',
    period: 0,
    dueDate: new Date(),
    appDueDate: new Date(),
  },
  {
    timeline: 'Procurement Requisition',
    period: 10,
    dueDate: new Date(),
    appDueDate: new Date(),
  },
  {
    timeline: 'Tender Publication',
    period: 10,
    dueDate: new Date(),
    appDueDate: new Date(),
  },
  {
    timeline: 'Tender Submission',
    period: 10,
    dueDate: new Date(),
    appDueDate: new Date(),
  },
  {
    timeline: ' Evaluation',
    period: 10,
    dueDate: new Date(),
    appDueDate: new Date(),
  },
  {
    timeline: 'Award',
    period: 10,
    dueDate: new Date(),
    appDueDate: new Date(),
  },
  {
    timeline: 'Contract Signing',
    period: 10,
    dueDate: new Date(),
    appDueDate: new Date(),
  },
  {
    timeline: 'Contract Closure',
    period: 10,
    dueDate: new Date(),
    appDueDate: new Date(),
  },
];

export default function TimelineTab({ activityId }: { activityId?: string }) {
  const [data, setData] = useState<any[]>(tableData);
  const { id } = useParams();

  const { data: procurementRequisition, isSuccess } = useReadQuery(
    id.toString(),
  );

  const [createTimeline, { isLoading: isTimelineCreating }] =
    useCreatePrTimelineMutation();

  const [getTimeline, { data: timeline, isSuccess: isTimelineSuccess }] =
    useLazyGetPrTimelineQuery();

  const listConfig: TableConfig<any> = {
    columns: [
      {
        header: 'Name',
        accessorKey: 'timeline',
      },

      {
        id: 'period',
        header: 'Period',
        accessorKey: 'period',
        cell: ({ getValue, row, column }) => (
          <Period getValue={getValue} row={row} column={column} />
        ),
      },

      {
        id: 'dueDate',
        header: 'Due Date',
        accessorKey: 'dueDate',
        cell: ({ getValue, row, column }) => (
          <DueDate getValue={getValue} row={row} column={column} />
        ),
      },
    ],
  };
  const listAppConfig: TableConfig<any> = {
    columns: [
      {
        header: 'Name',
        accessorKey: 'timeline',
      },

      {
        id: 'appDueDate',
        header: 'Planned Due Date',
        accessorKey: 'appDueDate',
        cell: ({ getValue, row, column }) => (
          <AppDueDate getValue={getValue} row={row} column={column} />
        ),
      },

      {
        id: 'period',
        header: 'Period',
        accessorKey: 'period',
        cell: ({ getValue, row, column }) => (
          <Period getValue={getValue} row={row} column={column} />
        ),
      },

      {
        id: 'dueDate',
        header: 'Due Date',
        accessorKey: 'dueDate',
        cell: ({ getValue, row, column }) => (
          <DueDate getValue={getValue} row={row} column={column} />
        ),
      },
    ],
  };

  const Period = ({ getValue, row: { index }, column: { id } }: any) => {
    const initialValue = getValue();
    const [value, setValue] = useState<string | number>(initialValue);

    const onBlur = () => {
      const formattedData = data.map((item, i) => {
        if (i === index) {
          return {
            ...item,
            [id]: value,
          };
        }
        return item;
      });
      setData(formattedData);
      setData((old) =>
        old.map((row, i) => {
          const cumulativeSum = old
            .slice(0, i + 1)
            .reduce((sum, item) => sum + item.period, 0);
          const currentDate = new Date(old[0].dueDate ?? new Date());
          currentDate.setDate(currentDate.getDate() + cumulativeSum);
          if (!isNaN(currentDate.getTime())) {
            return {
              ...row,
              dueDate: currentDate,
            };
          } else {
            return row;
          }
        }),
      );
    };
    return (
      <>
        {index == 0 ? (
          <TextInput
            rightSection={
              <Box className=" text-black border-l-2 p-2 mr-2">Days</Box>
            }
            disabled
            value="NA"
          />
        ) : (
          <NumberInput
            onBlur={onBlur}
            value={value}
            onChange={setValue}
            rightSection={
              <Box className=" text-black border-l-2 p-2 mr-6 ">Days </Box>
            }
            disabled={activityId ? true : false}
          />
        )}
      </>
    );
  };
  const DueDate = ({ getValue, row: { index }, column: { id } }: any) => {
    const initialValue = getValue();
    logger.log('app', initialValue);
    const [value, setValue] = useState<Date | null>(initialValue);

    const onBlur = () => {
      setData((old) => {
        return old.map((row, i) => {
          if (i === index) {
            return {
              ...old[index],
              [id]: value,
            };
          }
          return row;
        });
      });
      setData((old) =>
        old.map((row, i) => {
          const cumulativeSum = old
            .slice(0, i + 1)
            .reduce((sum, item) => sum + item.period, 0);
          const currentDate = new Date(old[0].dueDate ?? new Date());
          currentDate.setDate(currentDate.getDate() + cumulativeSum);
          if (!isNaN(currentDate.getTime())) {
            return {
              ...row,
              dueDate: currentDate,
            };
          } else {
            return row;
          }
        }),
      );
    };

    return (
      <>
        <DateInput
          valueFormat="DD-MMM-YYYY"
          onChange={setValue}
          value={value}
          placeholder="Pick date"
          onBlur={onBlur}
          minDate={new Date()}
          disabled={index != 0 || activityId ? true : false}
        />
      </>
    );
  };
  const AppDueDate = ({ getValue, row: { index }, column: { id } }: any) => {
    const initialValue = getValue();
    return (
      <>
        <DateInput
          valueFormat="DD-MMM-YYYY"
          value={new Date(initialValue)}
          placeholder="Pick date"
          disabled={true}
        />
      </>
    );
  };

  const handleSave = async () => {
    const activityId = { procurementRequisitionId: id };
    const castedData = data.map((d, index) => {
      return {
        ...activityId,
        dueDate: d.dueDate,
        period: d.period,
        timeline: d.timeline,
        order: index,
      };
    });

    try {
      await createTimeline(castedData).unwrap();
      notify('Success', 'Timeline saved successfully');
    } catch (err) {
      if (err.data.statusCode === 430) {
        notify('Error', err.data.message);
      } else {
        notify('Error', 'Something went wrong');
      }
    }
  };

  useEffect(() => {
    getTimeline({
      id: id.toString(),
      collectionQuery: undefined,
    });
  }, [getTimeline, id]);

  useEffect(() => {
    if (isTimelineSuccess && timeline?.total !== 0) {
      const castedData = timeline?.items?.map((t) => ({
        ...t,
        dueDate: new Date(t.dueDate),
        AppDueDate: new Date(t.appDueDate),
        fromDate: new Date(t.fromDate),
      }));
      castedData && setData([...castedData]);
    }
  }, [isTimelineSuccess, timeline?.items, timeline?.total]);

  return (
    <div className="mt-4">
      {isSuccess && procurementRequisition?.isPlanned && (
        <Table config={listAppConfig} data={data} />
      )}
      {data.length != 0 && isSuccess && !procurementRequisition?.isPlanned && (
        <Table config={listConfig} data={data} />
      )}
      {!activityId && (
        <Group className="mt-2" justify="end">
          <Button onClick={handleSave} loading={isTimelineCreating} mb={'sm'}>
            <IconDeviceFloppy size={16} /> Save
          </Button>
        </Group>
      )}
    </div>
  );
}
