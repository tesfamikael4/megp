'use client';
import { Section } from '@megp/core-fe';
import { FormDetail } from '@/app/(features)/_components/activity-form-detail';
import { Flex, Tabs, Tooltip } from '@mantine/core';
import { IconChevronLeft } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';

export default function NewActivity() {
  const router = useRouter();
  return (
    <>
      <Section
        title={
          <Tooltip
            label="List Activities"
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
            <Tabs.Tab value="definition">Activity Identification</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="definition" className="pt-2">
            <FormDetail mode="new" page="post" />
          </Tabs.Panel>
        </Tabs>
      </Section>
    </>
  );
}
