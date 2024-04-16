'use client';
import { Button, Flex } from '@mantine/core';
import Table from './_components/table';
import PageWrapper from '@/app/(features)/vendor/_components/page-wrapper';

function PurchaseOrders() {
  return (
    <PageWrapper title="Tender name" withBorder>
      <Flex className="flex-col gap-4">
        <Table />
        <Flex justify="flex-end" gap={16} className="pt-6">
          <Button
            // leftSection={<IconDeviceFloppy size={14} />}
            variant="outline"
            size="xs"
            w={100}
          >
            Save
          </Button>
          <Button
            // leftSection={<IconSend size={14} />}
            variant="filled"
            size="xs"
            w={100}
          >
            Submit
          </Button>
        </Flex>
      </Flex>
    </PageWrapper>
  );
}

export default PurchaseOrders;
