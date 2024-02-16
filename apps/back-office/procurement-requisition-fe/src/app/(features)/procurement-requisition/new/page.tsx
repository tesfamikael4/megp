'use client';
import { Section } from '@megp/core-fe';
import { FormDetail } from '../_components/mannual-pr';
import { Flex, Tabs, Tooltip } from '@mantine/core';
import { IconChevronLeft } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';

export default function NewPrPage() {
  const router = useRouter();
  return (
    <>
      <Section
        title={
          <Tooltip
            label="List Procurement Requisition"
            className="cursor-pointer"
            onClick={() => router.back()}
          >
            <Flex align="center">
              <IconChevronLeft />
              New
            </Flex>
          </Tooltip>
        }
      >
        <Tabs defaultValue="definition">
          <Tabs.List>
            <Tabs.Tab value="definition">
              Procurement Requisition Identification
            </Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="definition" className="pt-2">
            <FormDetail mode="new" />
          </Tabs.Panel>
        </Tabs>
      </Section>
    </>
  );
}
