'use client';

import {
  Accordion,
  AccordionControl,
  ActionIcon,
  Box,
  Container,
  Flex,
  Text,
  Tabs,
  Tooltip,
  rem,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import { IconChevronLeft } from '@tabler/icons-react';
import { Section } from '@megp/core-fe';

import { useRouter, useSearchParams } from 'next/navigation';
import { useParams } from 'next/navigation';
import { useDisclosure } from '@mantine/hooks';
import ShipmentList from '../../../_components/shipment/shipment-list';
import BudgetList from '../../../_components/list-of-items/budget-list';
import ReceiverList from '../../../_components/list-of-items/receiver-list';

export default function PoItemHomePage() {
  // const { data, isSuccess: succeed } = useReadQuery(id?.toString());
  const [currentTab, setCurrentTab] = useState('shipment');

  const activeTabStyle =
    'bg-gray-100 cursor-pointer border-l border-r border-t py-2 px-10 rounded-t text-gray-700 font-medium';
  const inActiveTabStyle =
    'cursor-pointer py-2 px-10 text-gray-700 font-medium';

  // const searchParams = useSearchParams();
  // const params = new URLSearchParams(searchParams.toString());
  // params.set('currentTab', 'items');

  return (
    <>
      <Box className="bg-white -mt-2">
        <Container size="xl">
          <Flex justify="space-between" className="p-2">
            <Tooltip
              label="List of Item"
              className="cursor-pointer"
              onClick={() => {
                // router.push(`/purchase-order/${id}` + params.toString());
              }}
            >
              <Flex align="center">
                <IconChevronLeft size={14} />
                <Text className="font-semibold text-lg">
                  {/* {data?.name ?? ''} */}
                  Item name
                </Text>
              </Flex>
            </Tooltip>
          </Flex>
          <Flex gap={10} className="mt-2 ml-2">
            <Box
              className={
                currentTab === 'shipment' ? activeTabStyle : inActiveTabStyle
              }
              onClick={() => setCurrentTab('shipment')}
            >
              Shipment
            </Box>

            <Box
              className={
                currentTab === 'budget' ? activeTabStyle : inActiveTabStyle
              }
              onClick={() => setCurrentTab('budget')}
            >
              Budget
            </Box>
            {/* <Box
              className={
                currentTab === 'receiver' ? activeTabStyle : inActiveTabStyle
              }
              onClick={() => setCurrentTab('receiver')}
            >
              Receiver
            </Box> */}
          </Flex>
        </Container>
      </Box>
      <Container size="xl">
        <Box className="mt-5 -mx-4  ">
          <Flex>
            {currentTab === 'shipment' && <ShipmentList />}

            {currentTab === 'budget' && <BudgetList />}

            {/* {currentTab === 'receiver' && <ReceiverList />} */}
          </Flex>
        </Box>
      </Container>
    </>
  );
}
