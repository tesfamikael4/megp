'use client';

import { Box, Button, Group, NumberInput, TextInput } from '@mantine/core';
import { Table, TableConfig, logger, notify } from '@megp/core-fe';

import { useEffect, useState } from 'react';
import { DateInput } from '@mantine/dates';
import { IconDeviceFloppy } from '@tabler/icons-react';
import { useParams } from 'next/navigation';
import {
  useCreatePreActivityTimelineMutation,
  useLazyGetPreBudgetTimelineQuery,
} from '@/store/api/pre-budget-plan/pre-budget-plan.api';
import {
  useCreatePostActivityTimelineMutation,
  useLazyGetPostBudgetTimelineQuery,
} from '@/store/api/post-budget-plan/post-budget-plan.api';

const tableData = [
  {
    operationMethod: 'Procurement Initiation',
    period: 0,
    toDate: new Date(),
  },
  {
    operationMethod: 'Procurement Requisition',
    period: 10,
    toDate: new Date(),
  },
  {
    operationMethod: 'Tender Publication',
    period: 10,
    toDate: new Date(),
  },
  {
    operationMethod: 'Tender Submission',
    period: 10,
    toDate: new Date(),
  },
  {
    operationMethod: ' Evaluation',
    period: 10,
    toDate: new Date(),
  },
  {
    operationMethod: 'Award',
    period: 10,
    toDate: new Date(),
  },
  {
    operationMethod: 'Contract Signing',
    period: 10,
    toDate: new Date(),
  },
  {
    operationMethod: 'Contract Closure',
    period: 10,
    toDate: new Date(),
  },
];

export default function TimelineTab({ page }: { page: 'pre' | 'post' }) {
  const [data, setData] = useState<any[]>(tableData);
  const { id } = useParams();
  const [createPreTimeline, { isLoading: isPreTimelineCreating }] =
    useCreatePreActivityTimelineMutation();
  const [createPostTimeline, { isLoading: isPostTimelineCreating }] =
    useCreatePostActivityTimelineMutation();
  const [
    getPreTimeline,
    { data: preTimeline, isSuccess: isPreTimelineSuccess },
  ] = useLazyGetPreBudgetTimelineQuery();
  const [
    getPostTimeline,
    { data: postTimeline, isSuccess: isPostTimelineSuccess },
  ] = useLazyGetPostBudgetTimelineQuery();
  const listConfig: TableConfig<any> = {
    columns: [
      {
        header: 'Name',
        accessorKey: 'operationMethod',
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
        id: 'date',
        header: 'Due Date',
        accessorKey: 'toDate',
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
          const currentDate = new Date(old[0].toDate ?? new Date());
          currentDate.setDate(currentDate.getDate() + cumulativeSum);
          if (!isNaN(currentDate.getTime())) {
            return {
              ...row,
              toDate: currentDate,
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
              <Box className=" text-black border-l-2 p-2 mr-2">Days</Box>
            }
          />
        )}
      </>
    );
  };
  const DueDate = ({ getValue, row: { index }, column: { id } }: any) => {
    const initialValue = getValue();
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
          disabled={index != 0}
        />
      </>
    );
  };

  const handleSave = async () => {
    const initialDay = data[0];
    const activityId =
      page == 'pre'
        ? { preBudgetPlanActivityId: id }
        : { postBudgetPlanActivityId: id };
    const castedData = data.map((d, index) => {
      return {
        ...activityId,
        fromDate: index === 0 ? initialDay.toDate : data[index - 1].toDate,
        toDate: d.toDate,
        period: d.period,
        operationMethod: d.operationMethod,
        order: index,
      };
    });
    logger.log({ castedData });

    try {
      if (page == 'pre') {
        await createPreTimeline(castedData).unwrap();
        notify('Success', 'Timeline saved successfully');
      } else if (page == 'post') {
        await createPostTimeline(castedData).unwrap();
        notify('Success', 'Timeline saved successfully');
      }
    } catch (err) {
      logger.log({ err });
      notify('Error', 'Something went wrong');
    }
  };

  useEffect(() => {
    if (page == 'pre') {
      getPreTimeline(id as string);
    } else if (page == 'post') {
      getPostTimeline(id as string);
    }
  }, [getPostTimeline, getPreTimeline, id, page]);

  useEffect(() => {
    if (page == 'pre' && isPreTimelineSuccess && preTimeline.total !== 0) {
      const castedData = preTimeline?.items?.map((t) => ({
        ...t,
        toDate: new Date(t.toDate),
        fromDate: new Date(t.fromDate),
      }));
      setData([...castedData]);
    } else if (
      page == 'post' &&
      isPostTimelineSuccess &&
      postTimeline.total !== 0
    ) {
      const castedData = postTimeline?.items?.map((t) => ({
        ...t,
        toDate: new Date(t.toDate),
        fromDate: new Date(t.fromDate),
      }));
      setData([...castedData]);
    }
  }, [
    isPostTimelineSuccess,
    isPreTimelineSuccess,
    page,
    postTimeline,
    preTimeline,
  ]);

  return (
    <div className="mt-4">
      {data.length != 0 && <Table config={listConfig} data={data} />}
      <Group className="mt-2" justify="end">
        <Button
          onClick={handleSave}
          loading={isPreTimelineCreating || isPostTimelineCreating}
        >
          <IconDeviceFloppy size={16} /> Save
        </Button>
      </Group>
    </div>
  );
}
