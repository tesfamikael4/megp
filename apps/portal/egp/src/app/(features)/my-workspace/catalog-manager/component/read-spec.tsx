'use client';
import { Box, Flex, Tooltip, Text, Tabs, Title } from '@mantine/core';
import { Section } from '@megp/core-fe';
import ViewImage from './view-image';
import CatalogForm from './catalog-form';
import { DeliverDays } from './table-delivery-days';
import { useRouter } from 'next/navigation';
import {
  IconChevronLeft,
  IconId,
  IconTruckDelivery,
} from '@tabler/icons-react';

export default function ReadSpec() {
  const router = useRouter();

  return (
    <>
      <Section collapsible={false}>
        <Box mih={'80vh'}>
          <Flex gap={'sm'}>
            <Box className="w-1/3">
              <ViewImage />
            </Box>
            <Box className="w-2/3 border shadow-sm p-4">
              <Tooltip
                label="List Product Catalog"
                className="cursor-pointer"
                onClick={() => router.back()}
                position="left-start"
                offset={5}
              >
                <Flex align="center" mb={'sm'}>
                  <IconChevronLeft size={14} />
                  <Text className="font-semibold text-lg">
                    Product Catalog Detail
                  </Text>
                </Flex>
              </Tooltip>
              <Tabs defaultValue="gallery">
                <Tabs.List>
                  <Tabs.Tab value="gallery" leftSection={<IconId size={16} />}>
                    <Title order={6}>Identification</Title>
                  </Tabs.Tab>
                  <Tabs.Tab
                    value="messages"
                    leftSection={<IconTruckDelivery size={16} />}
                    ml={'md'}
                  >
                    <Title order={6}>Delivery Location</Title>
                  </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="gallery" mt={'md'}>
                  <CatalogForm mode={'detail'} />
                </Tabs.Panel>

                <Tabs.Panel value="messages" mt={'md'}>
                  <DeliverDays />
                </Tabs.Panel>
              </Tabs>
            </Box>
          </Flex>
        </Box>
      </Section>
    </>
  );
}
