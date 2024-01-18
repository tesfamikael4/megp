'use client';

import { Box, Button, Group, NumberInput, TextInput } from '@mantine/core';
import { Table, TableConfig, notify } from '@megp/core-fe';

import { useEffect, useState } from 'react';
import { DateInput } from '@mantine/dates';
import { IconDeviceFloppy } from '@tabler/icons-react';
import { useParams } from 'next/navigation';

import {
  useCreateMutation,
  useLazyListByIdQuery,
} from '@/app/(features)/_api/timeline.api';

const tableData = [
  {
    timeline: 'Procurement Initiation',
    noOfDays: 0,
    dueDate: new Date(),
  },
  {
    timeline: 'Procurement Requisition',
    noOfDays: 10,
    dueDate: new Date(),
  },
  {
    timeline: 'Tender Publication',
    noOfDays: 10,
    dueDate: new Date(),
  },
  {
    timeline: 'Tender Submission',
    noOfDays: 10,
    dueDate: new Date(),
  },
  {
    timeline: ' Evaluation',
    noOfDays: 10,
    dueDate: new Date(),
  },
  {
    timeline: 'Award',
    noOfDays: 10,
    dueDate: new Date(),
  },
  {
    timeline: 'Contract Signing',
    noOfDays: 10,
    dueDate: new Date(),
  },
  {
    timeline: 'Contract Closure',
    noOfDays: 10,
    dueDate: new Date(),
  },
];

export default function TimelineTab() {
  const [data, setData] = useState<any[]>(tableData);
  const { id } = useParams();

  const [createPostTimeline, { isLoading: isPostTimelineCreating }] =
    useCreateMutation();

  const [
    getPostTimeline,
    { data: postTimeline, isSuccess: isPostTimelineSuccess },
  ] = useLazyListByIdQuery();
  const listConfig: TableConfig<any> = {
    columns: [
      {
        header: 'Name',
        accessorKey: 'timeline',
      },
      {
        id: 'noOfDays',
        header: 'No of days',
        accessorKey: 'noOfDays',
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
            .reduce((sum, item) => sum + item.noOfDays, 0);
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
      setData((old) =>
        old.map((row, i) => {
          const cumulativeSum = old
            .slice(0, i + 1)
            .reduce((sum, item) => sum + item.noOfDays, 0);
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
          disabled={index != 0}
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
        noOfDays: d.noOfDays,
        timeline: d.timeline,
        order: index,
      };
    });

    try {
      await createPostTimeline(castedData).unwrap();
      notify('Success', 'Timeline saved successfully');
    } catch (err) {
      notify('Error', 'Something went wrong');
    }
  };

  useEffect(() => {
    getPostTimeline({ id: id.toString(), collectionQuery: undefined });
  }, [getPostTimeline, id]);

  useEffect(() => {
    if (isPostTimelineSuccess && postTimeline?.total !== 0) {
      const castedData = postTimeline?.items?.map((t) => ({
        ...t,
        dueDate: new Date(t.dueDate),
        fromDate: new Date(t.fromDate),
      }));
      castedData && setData([...castedData]);
    }
  }, [isPostTimelineSuccess, postTimeline?.items, postTimeline?.total]);

  return (
    <div className="mt-4">
      {data.length != 0 && <Table config={listConfig} data={data} />}
      <Group className="mt-2" justify="end">
        <Button onClick={handleSave} loading={isPostTimelineCreating}>
          <IconDeviceFloppy size={16} /> Save
        </Button>
      </Group>
    </div>
  );
}
