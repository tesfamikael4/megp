'use client';
import { useLazyGetBidOpeningChecklistByLotIdQuery } from '@/store/api/tendering/tendering.api';
import { Table } from '@mantine/core';
import { Section } from '@megp/core-fe';
import { IconAlertCircle, IconCircleCheck } from '@tabler/icons-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const Checklist = () => {
  const [getChecklists, { data: checklistData }] =
    useLazyGetBidOpeningChecklistByLotIdQuery();

  useEffect(() => {
    getChecklists({ lotId: lotId as string, bidderId: bidderId as string });
  }, []);
  const router = useRouter();
  const { tenderId, lotId, bidderId } = useParams();
  return (
    <div>
      <Section title="Bid Attributes" className="h-full" collapsible={false}>
        <Table striped highlightOnHover withTableBorder withColumnBorders>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
          </Table.Tr>
          {checklistData?.map((list) => (
            <Table.Tr
              key={list.id}
              className="cursor-pointer"
              onClick={() =>
                router.push(
                  `/opening/${tenderId}/lots/${lotId}/${bidderId}/${list.id}`,
                )
              }
            >
              <Table.Td
                className={
                  list.check
                    ? 'flex justify-between items-center'
                    : 'font-semibold flex justify-between items-center'
                }
              >
                {list.name}

                {list.check ? (
                  <IconCircleCheck size={18} color="green" />
                ) : (
                  <IconAlertCircle size={18} color="red" />
                )}
              </Table.Td>
            </Table.Tr>
          ))}
        </Table>
      </Section>
    </div>
  );
};
