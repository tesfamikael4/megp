'use client';
import {
  IconBriefcase,
  IconChevronDown,
  IconFileCheck,
  IconFolder,
  IconSearch,
} from '@tabler/icons-react';
import {
  Flex,
  Input,
  SimpleGrid,
  Text,
  Menu,
  UnstyledButton,
  Pagination,
  Avatar,
} from '@mantine/core';
import DashboardCard from './_components/info-card';
import TenderCard from './_components/tender-card';
const infoCard = [
  {
    icon: (
      <Avatar color="#81D49A" variant="filled" radius={10} w={50}>
        <IconFolder size={32} stroke={0.8} className="text-white" />
      </Avatar>
    ),
    title: 'All Tenders',
    count: 3,

    percent: 50,
  },
  {
    icon: (
      <Avatar
        styles={{
          placeholder: {
            background: '#F6C488',
          },
        }}
        variant="filled"
        w={50}
        radius={10}
      >
        <IconBriefcase size={32} stroke={0.8} className="text-white" />
      </Avatar>
    ),
    title: 'Active Tenders',
    count: 2,
    percent: 10,
  },
  {
    icon: (
      <Avatar
        styles={{
          placeholder: {
            background: '#9CBEFF',
          },
        }}
        variant="filled"
        w={50}
        radius={10}
      >
        <IconFileCheck size={32} stroke={0.8} className="text-white" />
      </Avatar>
    ),
    title: 'Processing Tenders',
    count: 1,
    percent: 20,
  },
];
export default function MyTenders() {
  const { data, isLoading } = (() => ({
    data: Array.from({ length: 6 }), // Empty array for now
    isLoading: false,
  }))();
  return (
    <Flex p={0} className="flex-col gap-4">
      <DashboardCard infoCard={infoCard} />
      <Flex className="flex-col gap-6 bg-white p-6 shadow-sm">
        <Flex direction="column" align="start">
          <Text fw={600} fz={20} c={'primary.7'}>
            My Tenders
          </Text>
          <Text fz={14} c="#37415199">
            An invitation to tender ITT, otherwise known as a call for bids or a
            request for tenders, is a formal, structured procedure for
            generating competing offers from different potential suppliers or
            contractors looking to obtain an award of business activity in
            works, supply, or service contracts, often from companies.
          </Text>
        </Flex>

        <Flex
          align="center"
          justify="flex-end"
          gap={4}
          direction={{ base: 'column', sm: 'row' }}
          className="justify-end p-4"
        >
          <Flex
            align="end"
            className="w-1/2 h-4 gap-4"
            justify={{ base: 'flex-end', sm: 'flex-end' }}
          >
            <Input
              size="xs"
              placeholder="Search Tenders Here"
              leftSection={<IconSearch width={16} height={16} />}
              className="flex-grow bg-[#f5fbfe] w-auto ml-2"
            />
            <Menu
              shadow="lg"
              width={160}
              position="bottom-end"
              offset={13}
              withArrow
              arrowPosition="center"
            >
              <Menu.Target>
                <UnstyledButton
                  fz={14}
                  className="flex gap-2 px-2 py-1 border-b border-solid border-[var(--mantine-color-primary-filled)] items-center justify-center"
                >
                  Sort by: All Tenders
                  <IconChevronDown size={16} />
                </UnstyledButton>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item>All Tenders</Menu.Item>
                <Menu.Item>Latest Tenders</Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Flex>
        </Flex>
      </Flex>
      <SimpleGrid
        mt={{ base: 10, sm: 20 }}
        cols={{ base: 1, sm: 2, md: 2, lg: 2 }}
      >
        {data.map((_, index) => (
          <TenderCard key={index} color={'orange'} textColor="white" />
        ))}
      </SimpleGrid>
      <Flex className="w-full justify-end items-center mb-24 ">
        <Flex className="p-2 bg-white rounded-md shadow-sm">
          <Pagination total={5} />
        </Flex>
      </Flex>
    </Flex>
  );
}
