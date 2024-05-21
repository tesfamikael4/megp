'use client';
import { useLazyGetResponsivenessChecklistByLotIdQuery } from '@/store/api/tendering/technical-responsiveness.api';
import { Box, Table } from '@mantine/core';
import { ExpandableTable, ExpandableTableConfig, Section } from '@megp/core-fe';
import { IconAlertCircle, IconCircleCheck } from '@tabler/icons-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const Checklist = () => {
  const [getChecklists, { data: checklistData }] =
    useLazyGetResponsivenessChecklistByLotIdQuery();

  useEffect(() => {
    getChecklists({
      lotId: lotId as string,
      bidderId: bidderId as string,
      itemId: itemId as string,
    });
  }, []);
  const router = useRouter();
  const { tenderId, lotId, bidderId, itemId } = useParams();
  const config: ExpandableTableConfig = {
    minHeight: 50,
    columns: [
      { accessor: 'title', title: 'Name' },
      {
        accessor: '',
        title: '',
        render: (record) => {
          const totalItems = record.checklist.length;
          const checkedItems = record.checklist.filter(
            (item) => item.check,
          ).length;
          const percentageChecked = (checkedItems / totalItems) * 100;
          return (
            <p className="text-xs font-semibold border-2  h-7 w-7 rounded-full flex justify-center items-center">
              {percentageChecked}
            </p>
          );
        },
      },
    ],
    isExpandable: true,
    expandedRowContent: (record) => {
      return (
        <Box className="pl-5  bg-white">
          <Table striped highlightOnHover withColumnBorders>
            {record.checklist?.map((list) => (
              <Table.Tr
                key={list.id}
                className="cursor-pointer"
                onClick={() =>
                  router.push(
                    `/evaluation/${tenderId}/${lotId}/responsiveness/${itemId}/${bidderId}/${list.id}`,
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
                  {list.requirement}

                  {list.check ? (
                    <IconCircleCheck size={18} color="green" />
                  ) : (
                    <IconAlertCircle size={18} color="red" />
                  )}
                </Table.Td>
              </Table.Tr>
            ))}
          </Table>
        </Box>
      );
    },
  };
  return (
    <div>
      <Section title="Bid Attributes" className="h-full" collapsible={false}>
        <ExpandableTable config={config} data={checklistData ?? []} />
      </Section>
    </div>
  );
};
