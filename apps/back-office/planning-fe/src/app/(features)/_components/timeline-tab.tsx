'use client';

import { Box, Button, Group, NumberInput } from '@mantine/core';
import { Table, TableConfig } from '@megp/core-fe';

import { useState } from 'react';
import { DatePickerInput } from '@mantine/dates';
import { IconDeviceFloppy } from '@tabler/icons-react';

const tableData = [
  {
    name: 'Procurement Registration',
    period: 0,
    date: new Date(),
  },
  {
    name: 'Tender Publication',
    period: 10,
    date: new Date(),
  },
  {
    name: 'Tender Submission',
    period: 10,
    date: new Date(),
  },
  {
    name: ' Evaluation',
    period: 10,
    date: new Date(),
  },
  {
    name: 'Award',
    period: 10,
    date: new Date(),
  },
  {
    name: 'Contract Signing',
    period: 10,
    date: new Date(),
  },
  {
    name: 'Contract Closure',
    period: 10,
    date: new Date(),
  },
];

export default function TimelineTab() {
  const [data, setData] = useState<any[]>(tableData);
  const listConfig: TableConfig<any> = {
    columns: [
      {
        header: 'Name',
        accessorKey: 'name',
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
        accessorKey: 'date',
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
          const currentDate = new Date(old[0].date ?? new Date());
          currentDate.setDate(currentDate.getDate() + cumulativeSum);
          if (!isNaN(currentDate.getTime())) {
            return {
              ...row,
              date: currentDate,
            };
          } else {
            return row;
          }
        }),
      );
    };
    return (
      <>
        <NumberInput
          onBlur={onBlur}
          value={value}
          onChange={setValue}
          rightSection={
            <Box className=" text-black border-l-2 p-2 mr-2">Days</Box>
          }
        />
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
        {index === 0 ? (
          <DatePickerInput
            onChange={setValue}
            value={value}
            placeholder="Pick date"
            onBlur={onBlur}
          />
        ) : (
          <DatePickerInput
            clearable
            defaultValue={value}
            disabled
            placeholder="Pick date"
          />
        )}
      </>
    );
  };

  return (
    <div className="mt-4">
      {data.length != 0 && <Table config={listConfig} data={data} />}
      <Group className="mt-2" justify="end">
        <Button>
          <IconDeviceFloppy size={16} /> Save
        </Button>
      </Group>
    </div>
  );
}
