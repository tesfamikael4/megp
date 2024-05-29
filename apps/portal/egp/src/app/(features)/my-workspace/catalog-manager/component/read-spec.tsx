'use client';
import { Box, Flex, Tooltip, Text } from '@mantine/core';
import { Section } from '@megp/core-fe';
import ViewImage from './view-image';
import CatalogForm from './catalog-form';
import { DeliverDaysForm } from './delivery-days';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IconChevronLeft } from '@tabler/icons-react';

export default function ReadSpec() {
  const [currentTab, setCurrentTab] = useState('identification');
  const router = useRouter();

  const activeTabStyle =
    'bg-[#1D8E3F] cursor-pointer border-l border-r border-t py-2 px-10 rounded-t text-white font-medium ';
  const inActiveTabStyle =
    'cursor-pointer py-2 px-10 text-gray-700 font-medium';

  return (
    <>
      <Section collapsible={false}>
        <Box mih={'80vh'}>
          <Flex gap={'sm'}>
            <Box className="w-1/3">
              <ViewImage />
            </Box>
            <Box className="w-2/3 border shadow-sm">
              <Flex justify="space-between" className="p-2">
                <Tooltip
                  label="List Activities"
                  className="cursor-pointer"
                  onClick={() => router.back()}
                >
                  <Flex align="center">
                    <IconChevronLeft size={14} />
                    <Text className="font-semibold text-lg">Product</Text>
                  </Flex>
                </Tooltip>
              </Flex>
              <Flex gap={10} className=" ml-2">
                <Box
                  onClick={() => setCurrentTab('identification')}
                  fw={'bold'}
                  className={
                    currentTab === 'identification'
                      ? activeTabStyle
                      : inActiveTabStyle
                  }
                >
                  Product Definition
                </Box>
                <Box
                  onClick={() => setCurrentTab('Delivery Days')}
                  className={
                    currentTab === 'Delivery Days'
                      ? activeTabStyle
                      : inActiveTabStyle
                  }
                  fw={'bold'}
                >
                  Delivery Location
                </Box>
              </Flex>

              <Box className="w-full px-5">
                {/* <Flex className="w-full"> */}
                {currentTab === 'identification' && (
                  <CatalogForm mode={'detail'} />
                )}

                {currentTab === 'Delivery Days' && <DeliverDaysForm />}
                {/* </Flex> */}
              </Box>
            </Box>
          </Flex>
        </Box>
      </Section>
    </>
  );
}
