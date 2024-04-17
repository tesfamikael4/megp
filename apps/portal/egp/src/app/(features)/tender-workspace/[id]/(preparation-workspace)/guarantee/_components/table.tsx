import { useLazyGetLotQuery } from '@/app/(features)/_api/registration.api';
import { useGetRegisteredBidQuery } from '@/store/api/registered-bid/registered-bid.api';
import { Table, Text } from '@mantine/core';
import { logger } from '@megp/core-fe';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';

export const TableForm = ({ lotId }: { lotId?: string }) => {
  const { id } = useParams();
  const { data: data } = useGetRegisteredBidQuery(id?.toString());
  const [triggerLot, { data: lot }] = useLazyGetLotQuery();
  useEffect(() => {
    triggerLot(lotId?.toString());
  }, [lotId]);
  logger.log({ lotId });
  return (
    <div>
      {' '}
      <Table h={100} className="mb-5 ">
        <Table.Tbody className=" border-2">
          <Table.Tr className=" border-2 ">
            <Table.Th className="bg-[#edf3f8] font-normal   text-[14px]">
              Procuring Entity
            </Table.Th>
            <Table.Td>
              <Text size="sm">{data?.organizationName}</Text>
            </Table.Td>
          </Table.Tr>

          <Table.Tr className=" border-2 ">
            <Table.Th className="bg-[#edf3f8] font-normal   text-[14px]">
              Lot Reference Number
            </Table.Th>
            <Table.Td>
              <Text size="sm">{data?.procurementReferenceNumber}</Text>
            </Table.Td>
          </Table.Tr>

          <Table.Tr className=" border-2 ">
            <Table.Th className="bg-[#edf3f8] font-normal text-[14px]">
              Lot Name
            </Table.Th>
            <Table.Td>
              <Text size="sm">{data?.name}</Text>
            </Table.Td>
          </Table.Tr>
          <Table.Tr className=" border-2 ">
            <Table.Th className="bg-[#edf3f8]  font-normal text-[14px] ">
              Guarantee Amount
            </Table.Th>
            <Table.Td className=" ">
              <Text size="sm">
                {lotId === undefined
                  ? ''
                  : lot?.bdsBidSecurity === null
                    ? ''
                    : parseFloat(
                        lot?.bdsBidSecurity?.bidSecurityAmount,
                      ).toLocaleString() +
                      ' ' +
                      lot?.bdsBidSecurity?.bidSecurityCurrency}
              </Text>
            </Table.Td>
          </Table.Tr>
          <Table.Tr className=" border-2 ">
            <Table.Th className="bg-[#edf3f8]  font-normal text-[14px]">
              Guarantee Validity Date
            </Table.Th>
            <Table.Td className=" ">
              <Text size="sm">Feb 01, 2024</Text>
            </Table.Td>
          </Table.Tr>
          <Table.Tr className=" border-2 ">
            <Table.Th className="bg-[#edf3f8] font-normal text-[14px] ">
              Submission Deadline
            </Table.Th>
            <Table.Td className=" border-2">
              <Text size="sm">
                {data?.bdsSubmission.submissionDeadline
                  ? new Date(
                      data?.bdsSubmission.submissionDeadline,
                    ).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })
                  : ''}
                {/* {data?.bdsSubmission.submissionDeadline} */}
              </Text>
            </Table.Td>
          </Table.Tr>
          <Table.Tr className=" border-2 ">
            <Table.Th className="bg-[#edf3f8]  font-normal text-[14px] ">
              Procurement Stage
            </Table.Th>
            <Table.Td className=" ">
              <Text size="sm">Bidding</Text>
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
    </div>
  );
};
