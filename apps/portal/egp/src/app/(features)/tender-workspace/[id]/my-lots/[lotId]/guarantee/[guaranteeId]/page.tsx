'use client';

import { useGetGuranateeDocumentQuery } from '@/store/api/guarantee-document/guarantee-document.api';
import { useReadQuery } from '@/store/api/guarantee/guarantee.api';
import { Box, Button, Flex, Modal, Text, Table } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useParams } from 'next/navigation';
import { FormDetail } from '../_components/form-detail';
import { useGetRegisteredBidQuery } from '@/store/api/registered-bid/registered-bid.api';
import { useGetGuaranteeExtensionQuery } from '@/store/api/guarantee-extension/extension.api';

export default function BidSecurityPage() {
  const [opened, { open, close }] = useDisclosure(false);
  const { id, guaranteeId } = useParams();

  const { data: data } = useReadQuery(guaranteeId?.toString());
  const { data: tenderData } = useGetRegisteredBidQuery(id?.toString());
  const { data: extensionData } = useGetGuaranteeExtensionQuery(
    guaranteeId?.toString(),
  );
  const { data: document } = useGetGuranateeDocumentQuery(
    guaranteeId.toLocaleString(),
  );

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
                  {extensionData?.status === 'APPROVED' && (
                    <Button w={100} className=" ml-auto ">
                      Extend
                    </Button>
                  )}
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
                title="Applicatipn Letter for Bid Guarantee "
                size="lg"
              >
                <embed
                  src={document?.presignedUrl}
                  type="application/pdf"
                  width="100%"
                  height="800px"
                />
              </Modal>
            </Box>
          </Box>
        </Flex>
      )}
    </>
  );
}
