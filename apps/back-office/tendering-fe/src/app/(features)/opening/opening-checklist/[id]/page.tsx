'use client';

import {
  Box,
  Flex,
  Text,
  Button,
  Select,
  Textarea,
  Group,
  Modal,
} from '@mantine/core';
import { TenderOverView } from '../../[id]/_components/tender-overview';
import { ExpandableTable, ExpandableTableConfig, Section } from '@megp/core-fe';
import { IconAlertCircle, IconCircleCheck } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { useParams, useRouter } from 'next/navigation';

export default function OpeningChecklist() {
  const [opened, { open, close }] = useDisclosure(false);
  const router = useRouter();
  const { id } = useParams();
  const config: ExpandableTableConfig = {
    columns: [
      {
        accessor: 'title',
        render: (record) =>
          record.status === 'checked' ? (
            record.title
          ) : (
            <Text className="text-sm font-semibold">{record.title}</Text>
          ),
      },
      {
        accessor: 'status',
        title: '',
        width: 50,
        render: (record) =>
          record.status === 'checked' ? (
            <IconCircleCheck size={18} color="green" />
          ) : (
            <IconAlertCircle size={18} color="red" />
          ),
      },
    ],
  };
  const checklistData = [
    {
      title:
        'Internal auditor as independent party have been invited to witness the bid opening ceremony.',
      status: 'checked',
    },
    {
      title: 'Other interested observers attended the bid opening ceremony.',
      status: 'checked',
    },
    {
      title:
        'Registered representatives from mass media attending the bid opening ceremony',
      status: 'draft',
    },
    {
      title: 'The Bid Opening Team has opened each bid',
      status: 'draft',
    },
  ];
  return (
    <>
      <TenderOverView />
      <Flex gap={10} mt={10}>
        <Box className=" bg-white w-1/3">
          <Section title="Checklist" className="h-full" collapsible={false}>
            <ExpandableTable config={config} data={checklistData} />
          </Section>
        </Box>
        <Box className=" bg-white w-1/3">
          <Section
            title="The Bid Opening Team has opened each bid"
            collapsible={false}
            className="h-full"
          >
            <Select
              label="Status"
              data={['Available', 'Not Available']}
              withAsterisk
            />
            <Textarea label="Remark" autosize minRows={7} className="mt-2" />
            <Group className="mt-2" gap={10} justify="end">
              <Button>Save</Button>
              <Button
                variant="outline"
                onClick={() => router.push(`/opening/${id}`)}
              >
                Skip
              </Button>
            </Group>
          </Section>
        </Box>
        <Box className=" bg-white w-1/3">
          <Section
            title="Bid Opening Attendees"
            subTitle="Bid opening attendees"
            collapsible={false}
            action={<Button onClick={open}>Add</Button>}
            className="h-full"
          >
            <ExpandableTable
              config={{
                columns: [
                  {
                    accessor: 'fullName',
                  },
                ],
              }}
              data={[]}
            />
          </Section>
        </Box>
      </Flex>

      <Modal opened={opened} onClose={close} title="Add Attendees"></Modal>
    </>
  );
}
