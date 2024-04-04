'use client';

import { Badge, Button, Flex, Group, Modal, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ExpandableTable, Section, logger, notify } from '@megp/core-fe';
import { DateInput } from '@mantine/dates';
import { useState } from 'react';
import { useCreateMutation, useListByIdQuery } from '../../_api/ipdc.api';
import { useParams } from 'next/navigation';
import { AddMembers } from './members';
import { useCreateIpdcMembersMutation } from '@/store/api/iam/iam.api';

export const Ipdc = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [minEndDate, setMinEndDate] = useState<Date>(new Date());
  const [create, { isLoading: isCreating }] = useCreateMutation();
  const [createMembers] = useCreateIpdcMembersMutation();
  const { id } = useParams();
  const { data: ipdc } = useListByIdQuery({
    id: id as string,
    collectionQuery: {},
  });

  const config = {
    minHeight: 200,
    isExpandable: true,
    expandedRowContent: (record) => (
      <AddMembers
        record={record}
        onSave={(data) => onMemberSave(data, record.id)}
        page="ipdc"
      />
    ),
    columns: [
      { accessor: 'name' },

      // {
      //   accessor: 'members',
      //   width: 200,
      //   textAlign: 'center',
      //   render: (record) => 0,
      // },
      {
        accessor: 'status',
        width: 150,
        render: (record) => (
          <Badge color={record.status == 'Active' ? 'green' : 'yellow'}>
            {record.status}
          </Badge>
        ),
      },
    ],
  };

  const onMemberSave = async (members, id) => {
    try {
      await createMembers({ members, ipdcId: id }).unwrap();
      notify('Success', 'Members added successfully');
    } catch (err) {
      logger.log({ err });
      notify('Error', 'Something went wrong');
    }
  };

  const onSave = async () => {
    try {
      await create({
        startDate,
        endDate,
        procurementInstitutionId: id,
      }).unwrap();
      notify('Success', 'IPDC saved successfully');
      close();
    } catch (err) {
      notify('Error', 'Something went wrong');
    }
  };
  return (
    <>
      <Section
        title="IPDC"
        className="mt-4"
        defaultCollapsed
        action={<Button onClick={open}>Add</Button>}
      >
        <ExpandableTable
          config={config}
          data={ipdc?.items ?? []}
          total={ipdc?.total ?? 0}
        />
      </Section>

      <Modal
        opened={opened}
        onClose={close}
        title={<Text fw={500}>Add New IPDC</Text>}
        size={'lg'}
      >
        <Flex gap={'md'}>
          <DateInput
            label="Starting Date"
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
            onClick={onSave}
            loading={isCreating}
            disabled={!startDate || !endDate}
          >
            Save
          </Button>
        </Group>
      </Modal>
    </>
  );
};
