'use client';

import { useReadQuery } from '@/store/api/guarantee/guarantee.api';
import {
  useGetOrganazationQuery,
  useLazyGetOrganazationQuery,
} from '@/store/api/organazation/organazation.api';
import { Accordion, Box, Divider, Flex, Table, Text } from '@mantine/core';
import { logger } from '@megp/core-fe';
import { IconFileInvoice } from '@tabler/icons-react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
export default function BidSecurityPage() {
  const [openedTerm, setOpenedTerm] = useState(false);
  const togglePanel = () => {
    setOpenedTerm(!openedTerm);
  };
  const { id } = useParams();

  const { data: data, isSuccess } = useReadQuery(id?.toString());
  const { data: guarantor } = useGetOrganazationQuery(
    data?.guarantorId?.toString() || '',
  );

  return (
    <Flex w={'100%'}>
      <Box className=" w-full p-6 bg-[#e7f4f7]">
        <Box className=" w-full p-6 min-h-screen bg-white">
          <Flex direction={'column'} className="w-full py-2 mb-3 ">
            <Text fw={700} fz="xl" c={'#1D8E3F'}>
              Guarantee Info
            </Text>
          </Flex>
          <Table h={100} className="mb-5 ">
            <Table.Tbody className=" border-2">
              <Table.Tr className=" border-2 ">
                <Table.Th className="bg-[#edf3f8] font-normal  w-72  text-[14px]">
                  Guaranter Name
                </Table.Th>
                <Table.Td>
                  <Text size="sm">{guarantor?.name}</Text>
                </Table.Td>
              </Table.Tr>
              <Table.Tr className=" border-2 ">
                <Table.Th className="bg-[#edf3f8] font-normal text-[14px]">
                  Validity Date
                </Table.Th>
                <Table.Td>
                  <Text size="sm">Mar 30, 2024</Text>
                </Table.Td>
              </Table.Tr>

              <Table.Tr className=" border-2 ">
                <Table.Th className="bg-[#edf3f8] font-normal text-[14px]">
                  Request Date
                </Table.Th>
                <Table.Td>
                  <Text size="sm">
                    {data?.createdAt
                      ? new Date(data.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })
                      : ''}
                  </Text>
                </Table.Td>
              </Table.Tr>

              <Table.Tr>
                <Table.Th className="bg-[#edf3f8] font-normal text-[14px] ">
                  Submission Deadline
                </Table.Th>
                <Table.Td className=" ">
                  <Text size="sm">Mar 30,2024</Text>
                </Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Th className="bg-[#edf3f8] font-normal text-[14px] ">
                  Guarantee Status
                </Table.Th>
                <Table.Td className=" ">
                  <Text size="sm">{data?.status}</Text>
                </Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Th className="bg-[#edf3f8] font-normal text-[14px]  ">
                  Procuring Entity Name
                </Table.Th>
                <Table.Td className=" ">
                  <Text size="sm">Perago </Text>
                </Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Th className="bg-[#edf3f8] font-normal text-[14px] ">
                  Security Currency
                </Table.Th>
                <Table.Td className=" ">
                  <Text size="sm">MMK</Text>
                </Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Th className="bg-[#edf3f8] font-normal text-[14px] ">
                  Security Amount
                </Table.Th>
                <Table.Td className=" ">
                  <Text size="sm">{data?.amount}</Text>
                </Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Th className="bg-[#edf3f8] font-normal text-[14px]  ">
                  Security Form
                </Table.Th>
                <Table.Td className=" ">
                  <Text size="sm">string</Text>
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
                Guarantee Remarks
              </Accordion.Control>

              <Accordion.Panel c="dimmed" className="pl-5">
                {data?.remark}
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        </Box>
      </Box>
    </Flex>
  );
}
