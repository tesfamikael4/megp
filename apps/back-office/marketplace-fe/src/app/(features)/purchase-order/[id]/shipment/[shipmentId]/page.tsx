'use client';

import { Box, Container, Tabs, rem } from '@mantine/core';
import { IconPhoto } from '@tabler/icons-react';
import ListOfItems from '../../../_components/list-of-items/items';
// import ListOfItems from ';

export default function Page() {
  const iconStyle = { width: rem(12), height: rem(12) };
  return (
    <Box>
      <Container size="xl">
        <Tabs
          className="mt-5 "
          variant="outline"
          defaultValue={'items'}
          styles={{
            tab: {},
          }}
        >
          <Tabs.List className="bg-white">
            <Tabs.Tab
              value="items"
              leftSection={<IconPhoto style={iconStyle} />}
            >
              Items
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="items" className="mt-5">
            <ListOfItems mode={'under-shipment'} />
          </Tabs.Panel>
        </Tabs>
      </Container>
    </Box>
  );
}
