'use client';
import { Box, Flex, Text, TextInput } from '@mantine/core';
import PaymentListTable from './_components/table';
import { IconSearch } from '@tabler/icons-react';
import { useDebouncedState } from '@mantine/hooks';
import PageWrapper from '../../_components/page-wrapper';

function MyPayments() {
  const [search, setSearch] = useDebouncedState('', 500);

  return (
    <PageWrapper
      title=" My Payments"
      info="Welcome to My Payments! Here you can manage your payment information
            and view your transaction history."
      withBorder
      actions={
        <TextInput
          size="xs"
          maw={300}
          w="100%"
          leftSection={<IconSearch size={18} />}
          placeholder="Search files by lorem, lorem"
          rightSectionWidth={30}
          onChange={(event) => {
            setSearch(event.currentTarget.value);
          }}
        />
      }
    >
      <Flex className="flex-col gap-4">
        <PaymentListTable />
      </Flex>
    </PageWrapper>
  );
}

export default MyPayments;
