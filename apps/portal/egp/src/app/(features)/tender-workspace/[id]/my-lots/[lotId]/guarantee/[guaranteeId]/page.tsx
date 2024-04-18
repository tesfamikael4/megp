'use client';

import { useReadQuery } from '@/store/api/guarantee/guarantee.api';
import { useGetRegisteredBidQuery } from '@/store/api/registered-bid/registered-bid.api';
import { Box, Button, Divider, Flex, Modal, Table, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useParams } from 'next/navigation';
import { IconFileInvoice } from '@tabler/icons-react';
import { TableForm } from '../../components/table';
import { FormDetail } from '../_components/form-detail';

export default function BidSecurityPage() {
  const [opened, { open, close }] = useDisclosure(false);
  const { guaranteeId } = useParams();
  const { id } = useParams();

  const { data: data } = useReadQuery(guaranteeId?.toString());

  const { data: tenderData } = useGetRegisteredBidQuery(id?.toString());

  return (
    <>
      {data?.status === 'DRAFT' ? (
        <FormDetail mode="detail" />
      ) : (
        <Flex w={'100%'} justify={'center'} mt={20} mb={20}>
          <Box className=" w-full max-w-[800px] p-6 h-auto bg-white shadow-md rounded-md ">
            <Box className=" w-full p-6 h-auto bg-white">
              <Flex className="w-full py-2 mb-3  " justify={'space-between'}>
                <Text fw={600}>Guarantee Information</Text>
                <Flex gap={7}>
                  <Button w={100} variant="outline">
                    Cancel
                  </Button>
                  <Button
                    w={100}
                    className=" ml-auto "
                    // onClick={handleSubmit(onCreate, (err) => logger.log(err))}
                  >
                    Extend
                  </Button>
                </Flex>
              </Flex>
              <Table h={100} className="mb-5 ">
                <Table.Tbody className=" border-2">
                  <Table.Tr className=" border-2 ">
                    <Table.Th className="bg-[#edf3f8] font-normal  w-72  text-[14px]">
                      Guarantor Name
                    </Table.Th>
                    <Table.Td>
                      <Text size="sm">{data?.guarantorName}</Text>
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr className=" border-2 ">
                    <Table.Th className="bg-[#edf3f8] font-normal  w-72  text-[14px]">
                      Guarantor Branch Name
                    </Table.Th>
                    <Table.Td>
                      <Text size="sm">{data?.guarantorBranchName}</Text>
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Th className="bg-[#edf3f8] font-normal text-[14px] ">
                      Guarantee Type
                    </Table.Th>
                    <Table.Td className=" ">
                      <Text size="sm">Bid Security</Text>
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Th className="bg-[#edf3f8] font-normal text-[14px] ">
                      Guarantee Amount
                    </Table.Th>
                    <Table.Td className=" ">
                      <Text size="sm">
                        {parseFloat(tenderData?.budgetAmount).toLocaleString()}{' '}
                        {tenderData?.budgetAmountCurrency}
                      </Text>
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr className=" border-2 ">
                    <Table.Th className="bg-[#edf3f8] font-normal text-[14px]">
                      Request Date
                    </Table.Th>
                    <Table.Td>
                      <Text size="sm">
                        {data?.createdAt
                          ? new Date(data.createdAt).toLocaleDateString(
                              'en-US',
                              {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              },
                            )
                          : ''}
                      </Text>
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr className=" border-2 ">
                    <Table.Th className="bg-[#edf3f8] font-normal text-[14px]">
                      Guarantee Validity Date
                    </Table.Th>
                    <Table.Td>
                      <Text size="sm">Mar 30, 2024</Text>
                    </Table.Td>
                  </Table.Tr>

                  <Table.Tr>
                    <Table.Th className="bg-[#edf3f8] font-normal text-[14px] ">
                      Guarantee Status
                    </Table.Th>
                    <Table.Td className="capitalize ">
                      <Text
                        size="sm"
                        className="capitalize text-[#49c460] bg-[#ebfbee] border rounded-xl w-24 text-center"
                      >
                        {data?.status}
                      </Text>
                    </Table.Td>
                  </Table.Tr>
                </Table.Tbody>
              </Table>

              <Flex
                direction={{ base: 'column', sm: 'row' }}
                gap={{ base: 'sm', sm: 'lg' }}
                justify={{ sm: 'end' }}
              >
                <Box></Box>
                <Button w={100} onClick={open}>
                  Preview
                </Button>
              </Flex>
              <Modal
                opened={opened}
                onClose={close}
                title="Applicatipn Form for Bid Guarantee "
                size="lg"
              >
                <Box mb={20}>
                  <Text>Name/Title:</Text>
                  <Text>Bank Name:</Text>
                  <Text>Date:</Text>
                  <Text>
                    I/We would like to Request For Guarantee For Bid
                    Security(EMD) / Performance Guarantee / Mobilization Advance
                    / Release of Retention Money/ Security Deposit as per the
                    details given below:
                  </Text>
                </Box>
                <TableForm />
                <Flex>
                  <IconFileInvoice color="#40C057" />
                  <Text fw={600}> Declaration</Text>
                </Flex>
                <Text c="dimmed" className="pl-7 mt-2 text-justify">
                  I acknowledge that I have read, understood, and agree to the
                  terms outlined in MANEPS Privacy Policy. I hereby grant my
                  explicit consent for the collection, use, storage, and sharing
                  of my personal data as described in the Privacy Policy. The
                  information I provide may be used for contacting me for
                  service related or marketing communications, Enhancing and
                  personalizing my customer experience with MANEPS and to comply
                  with legal and regulatory obligations.
                </Text>
                <Divider my="md" className="w-full" size={'xs'} />
                <Text c="dimmed" className="pl-7 mt-2 text-justify">
                  In case of claim by the beneficiary, I/WE, hereby undertake to
                  reimburse on your first demand the amount paid by MANEPS to
                  ……………………………………………………………………………………. If I/We fail to reimburse,
                  the claimed amount may be converted to short-term business
                  loan at the prevailing interest rate and the tenure approved
                  by the Bank. In the event of failure to liquidate the loan,
                  I/We authorize MANEPS to take over the properties mortgaged to
                  the Bank in order to realize the amount payable by us.
                  Date:___________________________{' '}
                </Text>

                <Box mb={20}>
                  {' '}
                  <Text c="dimmed" className="pl-7 mt-10">
                    AUTHORIZED SIGNATORY & SEAL OF THE COMPANY
                  </Text>
                  <Text c="dimmed" className="pl-7 mt-2">
                    NAME________________________________
                  </Text>
                  <Text c="dimmed" className="pl-7 mt-2">
                    DESIGNATION________________________
                  </Text>
                </Box>
                <Text className="text-justify">
                  Please note: You are required to bring the original copy of
                  all the documents for verification by the concerned Bank
                  Officials.
                </Text>
              </Modal>
            </Box>
          </Box>
        </Flex>
      )}
    </>
  );
}
