'use client';

import { useLazyGetPreliminaryRequirementsByLotIdQuery } from '@/store/api/tendering/preliminary-compliance.api';
import { useLazyGetQualificationRequirementsByLotIdQuery } from '@/store/api/tendering/technical-qualification';
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

export const Requirements = ({
  milestone,
  teamAssessment = false,
}: {
  milestone:
    | 'technicalCompliance'
    | 'technicalQualification'
    | 'technicalResponsiveness';
  teamAssessment?: boolean;
}) => {
  const [getPreliminaryRequirements, { data: preliminaryRequirements }] =
    useLazyGetPreliminaryRequirementsByLotIdQuery();
  const [getQualificationRequirements, { data: qualificationRequirements }] =
    useLazyGetQualificationRequirementsByLotIdQuery();

  useEffect(() => {
    if (milestone === 'technicalCompliance') {
      getPreliminaryRequirements({
        lotId: lotId as string,
        bidderId: bidderId as string,
        team: teamAssessment ? 'teamLeader' : 'member',
      });
    } else if (milestone === 'technicalQualification') {
      getQualificationRequirements({
        lotId: lotId as string,
        bidderId: bidderId as string,
        team: teamAssessment ? 'teamLeader' : 'member',
      });
    }
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
                onClick={() => {
                  let url = '';
                  if (teamAssessment) {
                    url = `/evaluation/team-assessment/${tenderId}/${lotId}/qualification/${bidderId}/${list.id}`;
                  } else if (!teamAssessment) {
                    url = `/evaluation/${tenderId}/${lotId}/qualification/${bidderId}/${list.id}`;
                  }
                  router.push(url);
                }}
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
      <Section title="Requirements1" className="h-full" collapsible={false}>
        {milestone === 'technicalCompliance' && (
          <Table striped highlightOnHover withTableBorder withColumnBorders>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
            </Table.Tr>
            {preliminaryRequirements?.map((list) => (
              <Table.Tr
                key={list.id}
                className="cursor-pointer"
                onClick={() => {
                  let url = '';
                  if (milestone === 'technicalCompliance' && teamAssessment)
                    url = `/evaluation/team-assessment/${tenderId}/${lotId}/preliminary/${bidderId}/${list.id}`;
                  else if (
                    milestone === 'technicalCompliance' &&
                    !teamAssessment
                  )
                    url = `/evaluation/${tenderId}/${lotId}/preliminary/${bidderId}/${list.id}`;
                  router.push(url);
                }}
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
        )}

        {milestone === 'technicalQualification' && (
          <ExpandableTable
            config={config}
            data={qualificationRequirements ?? []}
          />
        )}
      </Section>
    </div>
  );
};
