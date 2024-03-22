'use client';

import TenderCard from '@/app/(features)/_components/tender-card';
import {
  Box,
  Flex,
  Input,
  Select,
  SimpleGrid,
  Text,
  Divider,
  Avatar,
  Menu,
  UnstyledButton,
} from '@mantine/core';
import {
  IconBriefcase,
  IconChevronDown,
  IconFileCheck,
  IconFolder,
  IconSearch,
} from '@tabler/icons-react';
import DashboardCard from '../../_components/card';
import EmptyPlaceholder from '../../_components/empty-placeholder';
import PageWrapper from '../../_components/page-wrapper';

type TendersProps = {
  title: string;
};
const infoCard = [
  {
    icon: (
      <Avatar color="#81D49A" variant="filled" radius={10}>
        <IconFolder size={32} stroke={1.5} className="text-white" />
      </Avatar>
    ),
    title: 'All Tenders',
    count: 0,
    percent: 0,
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
        radius={10}
      >
        <IconBriefcase size={32} stroke={1.5} className="text-white" />
      </Avatar>
    ),
    title: 'Active Tenders',
    count: 0,
    percent: 0,
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
        radius={10}
      >
        <IconFileCheck size={32} stroke={1.5} className="text-white" />
      </Avatar>
    ),
    title: 'Processing Tenders',
    count: 0,
    percent: 0,
  },
];
export default function MyTenders() {
  const { data, isLoading } = (() => ({
    data: Array.from({ length: 8 }), // Empty array for now
    isLoading: false,
  }))();
  return (
    <PageWrapper
      condition={data.length > 0}
      isLoading={isLoading}
      placeholder={<EmptyPlaceholder />}
    >
      <DashboardCard infoData={infoCard} />
      <Box>
        <Box>
          <Flex direction="column" align="start" className="space-y-4">
            <Text fw={700} size="xl" className="mt-4 text-green-500 ml-4">
              My Tenders
            </Text>
            <Text c="dimmed" fs="sm" mb={16} className="ml-4">
              An invitation to tender ITT, otherwise known as a call for bids or
              a request for tenders, is a formal, structured procedure for
              generating competing offers from different potential suppliers or
              contractors looking to obtain an award of business activity in
              works, supply, or service contracts, often from companies.
            </Text>
          </Flex>

          <Flex
            align="center"
            justify="flex-end"
            mb={{ base: 'md', sm: 'md' }}
            gap={4}
            direction={{ base: 'column', sm: 'row' }}
            className="justify-end mt-4  "
          >
            <Flex
              align="end"
              className="w-1/2  mb-4 h-4 gap-4"
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
        </Box>
        <SimpleGrid
          mt={{ base: 10, sm: 20 }}
          cols={{ base: 1, sm: 2, md: 2, lg: 2 }}
          className="mr-5 ml-5"
        >
          {Array.from({ length: 8 }).map((_, index) => (
            <TenderCard key={index} color={'orange'} />
          ))}
        </SimpleGrid>
      </Box>
    </PageWrapper>
  );
}
