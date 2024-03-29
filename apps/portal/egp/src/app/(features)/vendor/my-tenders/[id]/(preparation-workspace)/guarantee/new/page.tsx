'use client';

import { Accordion, Box, Divider, Flex, Table, Text } from '@mantine/core';
import { IconFileInvoice } from '@tabler/icons-react';
import { useState } from 'react';
import FormDetail from '../_components/form-detail';
import { useParams } from 'next/navigation';
import { useGetRegisteredBidQuery } from '@/store/api/registered-bid/registered-bid.api';
export default function BidSecurityPage() {
  const [openedTerm, setOpenedTerm] = useState(false);
  const togglePanel = () => {
    setOpenedTerm(!openedTerm);
  };
  const { id } = useParams();
  const { data: data } = useGetRegisteredBidQuery(id?.toString());
  return (
    <Flex w={'100%'}>
      <Box className=" w-full p-6 bg-[#e7f4f7]">
        <Box className=" w-full p-6 min-h-screen bg-white">
          <Flex direction={'column'} className="w-full py-2 mb-3 ">
            <Text fw={700} fz="xl" c={'#1D8E3F'}>
              Lot Info
            </Text>
          </Flex>
          <Table h={100} className="mb-5 ">
            <Table.Tbody className=" border-2">
              <Table.Tr className=" border-2 ">
                <Table.Th className="bg-[#edf3f8] font-normal  w-72 font-normal text-[14px]">
                  Reference Number
                </Table.Th>
                <Table.Td>
                  <Text size="sm">{data?.procurementReferenceNumber}</Text>
                </Table.Td>
              </Table.Tr>
              <Table.Tr className=" border-2 ">
                <Table.Th className="bg-[#edf3f8] font-normal text-[14px]">
                  Tender Name
                </Table.Th>
                <Table.Td>
                  <Text size="sm">{data?.name}</Text>
                </Table.Td>
              </Table.Tr>

              <Table.Tr>
                <Table.Th className="bg-[#edf3f8] font-normal text-[14px]">
                  Valid Date
                </Table.Th>
                <Table.Td className=" ">
                  <Text size="sm">Feb/01/2024</Text>
                </Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Th className="bg-[#edf3f8] font-normal text-[14px] ">
                  Submission Deadline
                </Table.Th>
                <Table.Td className=" ">
                  <Text size="sm">Mar/30/2024</Text>
                </Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Th className="bg-[#edf3f8] font-normal text-[14px] ">
                  Security Amount
                </Table.Th>
                <Table.Td className=" ">
                  <Text size="sm">{data?.budgetAmount}</Text>
                </Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>
          <Divider my="md" className="w-full" size={'xs'} />

          <Accordion className="" defaultValue="Terms and Conditions">
            <Accordion.Item value={'    Terms and Conditions'}>
              <Accordion.Control
                className="pl-0"
                icon={<IconFileInvoice />}
                styles={{
                  icon: {
                    color: '#40C057',
                  },
                }}
                onClick={togglePanel}
              >
                Terms and Conditions
              </Accordion.Control>
              {!openedTerm && (
                <Text c="dimmed" className="pl-9 line-clamp-1 text-[14px]">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Aliquam varius sollicitudin dictum. Nulla pulvinar accumsan
                  nunc, non ultrices dolor elementum ut. Maecenas accumsan,
                  risus vitae maximus facilisis, est purus mollis lacus, eu
                  volutpat lacus purus non velit. Integer malesuada ultricies ex
                  ut pellentesque. Nulla facilisi. Integer elementum porta nisi
                  vitae vestibulum. Maecenas id neque vestibulum, convallis
                  lacus sit amet, suscipit sapien. Aliquam sed neque erat. Cras
                  ipsum magna, vehicula viverra diam eu, blandit pharetra ipsum.
                  Curabitur efficitur nibh id ex varius pulvinar.
                </Text>
              )}
              <Accordion.Panel c="dimmed" className="pl-5">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam
                varius sollicitudin dictum. Nulla pulvinar accumsan nunc, non
                ultrices dolor elementum ut. Maecenas accumsan, risus vitae
                maximus facilisis, est purus mollis lacus, eu volutpat lacus
                purus non velit. Integer malesuada ultricies ex ut pellentesque.
                Nulla facilisi. Integer elementum porta nisi vitae vestibulum.
                Maecenas id neque vestibulum, convallis lacus sit amet, suscipit
                sapien. Aliquam sed neque erat. Cras ipsum magna, vehicula
                viverra diam eu, blandit pharetra ipsum. Curabitur efficitur
                nibh id ex varius pulvinar.
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>

          <FormDetail mode="new" />
        </Box>
      </Box>
    </Flex>
  );
}
