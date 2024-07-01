'use client';

import { Box, Container, Flex, Text, Tooltip } from '@mantine/core';
import { useState } from 'react';
import { FormDetail } from '../_components/FormDetail';
import { IconChevronLeft } from '@tabler/icons-react';
import { Documents } from '../_components/file-attachment';
import ListOfItems from '../_components/list-of-items/items';
import PoTerm from '../_components/po-term';
import { useRouter } from 'next/navigation';
import ShipmentList from '../_components/shipment/shipment-list';

export default function PrDetailPage() {
  const router = useRouter();
  // const { data, isSuccess: succeed } = useReadQuery(id?.toString());
  const [currentTab, setCurrentTab] = useState('preparation');

  const activeTabStyle =
    'bg-gray-100 cursor-pointer border-l border-r border-t py-2 px-10 rounded-t text-gray-700 font-medium';
  const inActiveTabStyle =
    'cursor-pointer py-2 px-10 text-gray-700 font-medium';

  return (
    <>
      <Box className="bg-white -mt-5">
        <Container size="xl">
          <Flex justify="space-between" className="p-2">
            <Tooltip
              label="List Activities"
              className="cursor-pointer"
              onClick={() => router.back()}
            >
              <Flex align="center">
                <IconChevronLeft size={14} />
                <Text className="font-semibold text-lg">
                  {/* {data?.name ?? ''} */}
                  Po Name
                </Text>
              </Flex>
            </Tooltip>
          </Flex>
          <Flex gap={10} className="mt-2 ml-2">
            <Box
              className={
                currentTab === 'preparation' ? activeTabStyle : inActiveTabStyle
              }
              onClick={() => setCurrentTab('preparation')}
            >
              Purchase Order Preparation
            </Box>

            <Box
              className={
                currentTab === 'items' ? activeTabStyle : inActiveTabStyle
              }
              onClick={() => setCurrentTab('items')}
            >
              Items
            </Box>
            <Box
              className={
                currentTab === 'documents' ? activeTabStyle : inActiveTabStyle
              }
              onClick={() => setCurrentTab('documents')}
            >
              Documents
            </Box>
            <Box
              className={
                currentTab === 'terms' ? activeTabStyle : inActiveTabStyle
              }
              onClick={() => setCurrentTab('terms')}
            >
              Purchase Order Terms
            </Box>
            <Box
              className={
                currentTab === 'shipment' ? activeTabStyle : inActiveTabStyle
              }
              onClick={() => setCurrentTab('shipment')}
            >
              Shipment
            </Box>
          </Flex>
        </Container>
      </Box>
      <Container size="xl">
        <Box className="mt-5 -mx-4  ">
          <Flex>
            {currentTab === 'preparation' && (
              <FormDetail mode="detail" disableFields={false} />
            )}

            {currentTab === 'items' && <ListOfItems mode="under-po" />}

            {currentTab === 'documents' && <Documents disableFields={false} />}

            {currentTab === 'terms' && <PoTerm />}
            {currentTab === 'shipment' && <ShipmentList />}
          </Flex>
        </Box>
      </Container>
    </>
  );
}
