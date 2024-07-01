'use client';

import {
  Accordion,
  AccordionControl,
  Box,
  Container,
  Flex,
  Tabs,
  rem,
} from '@mantine/core';
import { useState } from 'react';
import { FormDetail } from '../../_components/FormDetail';
import {
  IconCreditCardPay,
  IconMessageCircle,
  IconPhoto,
  IconReceipt,
  IconSettings,
  IconTruckDelivery,
} from '@tabler/icons-react';
import { Section } from '@megp/core-fe';
import { Documents } from '../../_components/file-attachment';
import ListOfItems from '../../_components/list-of-items/items';
import PoTerm from '../../_components/po-term';

export default function Page() {
  const iconStyle = { width: rem(12), height: rem(12) };
  return (
    <Box>
      <Container size="xl">
        <Tabs
          className="mt-5 "
          variant="outline"
          defaultValue={'po-preparation'}
          styles={{
            tab: {},
          }}
        >
          <Tabs.List className="bg-white">
            <Tabs.Tab
              value="po-preparation"
              leftSection={<IconPhoto style={iconStyle} />}
            >
              PO Preparation
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="po-preparation" className="mt-5">
            <FormDetail mode="new" />
          </Tabs.Panel>
        </Tabs>
      </Container>
    </Box>
  );
}
