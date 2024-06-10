'use client';
import { useGetMyResponsesQuery } from '@/store/api/rfx/rfx.api';
import { Flex, LoadingOverlay, Table } from '@mantine/core';
import { Section } from '@megp/core-fe';
import { IconProgress } from '@tabler/icons-react';
import { IconAlertCircle, IconCircleCheck } from '@tabler/icons-react';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';

export default function Requirments({
  teamAssessment = false,
}: {
  teamAssessment?: boolean;
}) {
  const { id, bidderId, requirmentId, assessmentMode } = useParams();
  const router = useRouter();

  const { data: requirments, isLoading: isGettingRequirments } =
    useGetMyResponsesQuery({
      rfxId: id.toString(),
      isTeamAssessment: assessmentMode == 'team' ? true : false,
      bidderId: bidderId.toString(),
    });

  return (
    <Section title="Requirments" collapsible={false}>
      <LoadingOverlay visible={isGettingRequirments} />
      {requirments && (
        <Table striped highlightOnHover withTableBorder withColumnBorders>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
          </Table.Tr>
          {requirments?.map((list) => (
            <Table.Tr
              key={list.id}
              className={`${requirmentId == list.id && 'bg-neutral-200'} cursor-pointer hover:bg-primary-100`}
              onClick={() => {
                let url = '';
                if (teamAssessment)
                  url = `/evaluation/team-assessment/${id}/${bidderId}/${list.id}`;
                else
                  url = `/evaluation/${id}/${assessmentMode}/${bidderId}/${list.id}`;
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
                <Flex className="flex-col">
                  <p>{list.documentTitle}</p>
                  <p className="text-xs text-gray-500">{list.description}</p>
                </Flex>

                {list.complied == 1 ? (
                  <IconCircleCheck size={18} color="green" />
                ) : list.notComplied == 1 ? (
                  <IconAlertCircle size={18} color="red" />
                ) : (
                  <IconProgress size={18} />
                )}
              </Table.Td>
            </Table.Tr>
          ))}
        </Table>
      )}
    </Section>
  );
}
