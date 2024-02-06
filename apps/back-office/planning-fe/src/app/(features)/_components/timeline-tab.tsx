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
import { ExpandableTable } from './expandable-table';

const getNewDate = (period: number) => {
  const newDate = new Date().setDate(new Date().getDate() + period);
  return new Date(newDate);
};

const tableData = [
  {
    timeline: 'Procurement Initiation',
    period: 0,
    dueDate: new Date(),
  },
  {
    timeline: 'Procurement Requisition',
    period: 10,
    dueDate: getNewDate(10),
  },
  {
    timeline: 'Tender Publication',
    period: 10,
    dueDate: getNewDate(20),
  },
  {
    timeline: 'Tender Submission',
    period: 10,
    dueDate: getNewDate(30),
  },
  {
    timeline: ' Evaluation',
    period: 10,
    dueDate: getNewDate(40),
  },
  {
    timeline: 'Award',
    period: 10,
    dueDate: getNewDate(50),
  },
  {
    timeline: 'Contract Signing',
    period: 10,
    dueDate: getNewDate(60),
  },
  {
    timeline: 'Contract Closure',
    period: 10,
    dueDate: getNewDate(70),
  },
];

export default function TimelineTab({
  page,
  disableFields = false,
}: {
  page: 'pre' | 'post';
  disableFields?: boolean;
}) {
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
  const listConfig = {
    columns: [
      {
        title: 'Name',
        accessor: 'timeline',
      },
      {
        title: 'Period',
        accessor: 'period',
        render: (record) => <Period record={record} />,
      },
      {
        title: 'Due Date',
        accessor: 'dueDate',
        render: (record) => <DueDate record={record} />,
      },
    ],
  };

  const Period = ({ record }: any) => {
    const initialValue = record.period;
    const [value, setValue] = useState<string | number>(initialValue);
    const index = data.indexOf(record);

    const onBlur = () => {
      const formattedData = data.map((item, i) => {
        if (i === index) {
          return {
            ...item,
            period: value == '' || (value as number) < 0 ? 0 : value,
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
            min={0}
            rightSection={
              <Box className=" text-black border-l-2 p-2 mr-2">Days</Box>
            }
            disabled={disableFields}
          />
        )}
      </>
    );
  };
  const DueDate = ({ record }: any) => {
    const initialValue = record.dueDate;
    const [value, setValue] = useState<Date | null>(initialValue);
    const index = data.indexOf(record);

    const onBlur = () => {
      setData((old) => {
        return old.map((row, i) => {
          if (i === index) {
            return {
              ...old[index],
              dueDate: value,
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
          disabled={index != 0 || disableFields}
        />
      </>
    );
  };

  const handleSave = async () => {
    const activityId =
      page == 'pre'
        ? { preBudgetPlanActivityId: id }
        : { postBudgetPlanActivityId: id };
    const castedData = data.map((d, index) => {
      return {
        ...activityId,
        dueDate: d.dueDate,
        period: d.period,
        timeline: d.timeline,
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
        dueDate: new Date(t.dueDate),
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
        dueDate: new Date(t.dueDate),
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
      {/* {data.length != 0 && <Table config={listConfig} data={data} />} */}
      <ExpandableTable data={data} config={listConfig} />
      <Group className="mt-2" justify="end">
        <Button
          onClick={handleSave}
          loading={isPreTimelineCreating || isPostTimelineCreating}
          disabled={disableFields}
        >
          <IconDeviceFloppy size={16} /> Save
        </Button>
      </Group>
    </div>
  );
}
