'use client';
import { Box, Button, Flex, Text } from '@mantine/core';
import 'mantine-datatable/styles.layer.css';
import '@mantine/core/styles.layer.css';
import { useMediaQuery } from '@mantine/hooks';
import Table from '../_components/table';
import styles from '../_components/sidebar/sidebar.module.scss';
import Sidebar from '../_components/sidebar/sidebar';

function PurchaseOrders() {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <Flex>
      <nav
        className={styles.nav}
        style={{
          backgroundColor: '#fff',
          display: isMobile ? 'none' : 'block',
        }}
      >
        <Sidebar />
      </nav>
      <Box className="w-full flex p-6 bg-[#e7f4f7]">
        <Box className=" w-full p-6 bg-white">
          <Flex direction={'column'} className="py-2 mb-4 border-b-2">
            <Text fw={700} fz="xl" c={'#1D8E3F'}>
              Tender name
            </Text>
          </Flex>
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
        </Box>
      </Box>
    </Flex>
  );
}

export default PurchaseOrders;
