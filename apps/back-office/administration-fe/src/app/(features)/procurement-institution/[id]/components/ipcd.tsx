'use client';

import { Button, Flex, Group, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ExpandableTable, Section, logger } from '@megp/core-fe';
import { DateInput } from '@mantine/dates';
import { useState } from 'react';

export const Ipdc = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [minEndDate, setMinEndDate] = useState<Date>(new Date());
  return (
    <>
      <Section
        title="IPDC"
        className="mt-4"
        defaultCollapsed
        action={<Button onClick={open}>Add</Button>}
      >
        <ExpandableTable
          config={{ columns: [{ accessor: 'name' }] }}
          data={[]}
        />
      </Section>

      <Modal opened={opened} onClose={close} title="Add New IPDC" size={'lg'}>
        <Flex gap={'md'}>
          <DateInput
            label="Start Date"
            className="w-full"
            minDate={new Date()}
            value={startDate}
            onChange={(val) => {
              setStartDate(val);
              if (val) {
                const minDate = new Date(val?.toString());
                minDate.setFullYear(minDate.getFullYear() + 3);
                setMinEndDate(minDate);
              }
            }}
          />
          <DateInput
            label="End Date"
            className="w-full"
            value={endDate}
            onChange={setEndDate}
            minDate={minEndDate}
            disabled={startDate ? false : true}
          />
        </Flex>
        <Group justify="end" className="mt-2">
          <Button
            onClick={() => {
              logger.log({ startDate, endDate });
              close();
              setEndDate(null);
              setStartDate(null);
            }}
          >
            Save
          </Button>
        </Group>
      </Modal>
    </>
  );
};
