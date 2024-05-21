'use client';
import { useLazyGetPreliminaryChecklistByLotIdQuery } from '@/store/api/tendering/preliminary-compliance.api';
import { Table } from '@mantine/core';
import { Section, logger } from '@megp/core-fe';
import { IconAlertCircle, IconCircleCheck } from '@tabler/icons-react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const Checklist = () => {
  const [getChecklists, { data: checklistData }] =
    useLazyGetPreliminaryChecklistByLotIdQuery();

  useEffect(() => {
    getChecklists({
      lotId: lotId as string,
      bidderId: bidderId as string,
      team: 'teamLeader',
    });
  }, []);
  const router = useRouter();
  const { tenderId, lotId, bidderId } = useParams();
  return (
    <div>
      <Section title="Requirement" className="h-full" collapsible={false}>
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
                  `/evaluation/team-assessment/${tenderId}/${lotId}/${bidderId}/${list.id}`,
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
                {list.itbDescription}

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
