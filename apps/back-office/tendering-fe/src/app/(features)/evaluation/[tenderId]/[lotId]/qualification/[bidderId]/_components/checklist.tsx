'use client';
import { useLazyGetQualificationChecklistByLotIdQuery } from '@/store/api/tendering/technical-qualification';
import { Box, Table, Tooltip } from '@mantine/core';
import { ExpandableTable, ExpandableTableConfig, Section } from '@megp/core-fe';
import {
  IconAlertCircle,
  IconCircleCheck,
  IconProgress,
  IconProgressAlert,
} from '@tabler/icons-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const Checklist = () => {
  const [getChecklists, { data: checklistData }] =
    useLazyGetQualificationChecklistByLotIdQuery();

  useEffect(() => {
    getChecklists({ lotId: lotId as string, bidderId: bidderId as string });
  }, []);
  const router = useRouter();
  const { tenderId, lotId, bidderId } = useParams();
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

          return percentageChecked == 0 ? (
            <Tooltip label="Not Started Yet">
              <IconProgressAlert size={18} color="gray" />
            </Tooltip>
          ) : percentageChecked != 100 ? (
            <Tooltip label="Inprogress">
              <IconProgress size={18} color="orange" />
            </Tooltip>
          ) : (
            <Tooltip label="Completed">
              <IconCircleCheck size={18} color="green" />
            </Tooltip>
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
                    `/evaluation/${tenderId}/${lotId}/qualification/${bidderId}/${list.id}`,
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
                    <Tooltip label="Evaluated">
                      <IconCircleCheck size={18} color="green" />
                    </Tooltip>
                  ) : (
                    <Tooltip label="Not Evaluated Yet">
                      <IconAlertCircle size={18} color="red" />
                    </Tooltip>
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
      <Section title="Requirements" className="h-full" collapsible={false}>
        <ExpandableTable config={config} data={checklistData ?? []} />
      </Section>
    </div>
  );
};
