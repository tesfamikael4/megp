'use client';
import {
  Box,
  Button,
  Flex,
  Group,
  LoadingOverlay,
  Pagination,
  Stack,
} from '@mantine/core';
import { ExpandableTable, Section } from '@megp/core-fe';
import { useContext, useEffect, useState } from 'react';
import ItemConfiguration from '../../rfx/_components/item/item-configuration';
import { useParams } from 'next/navigation';
import { ItemDetailSpec } from '../../evaluation/_component/item-specification.component';
import { StatusContext } from '@/contexts/rfx-status.context';
import { useLazyGetItemsForEvaluationQuery } from '@/store/api/rfx/eval-approval.api';
import { useGetCurrentWorkflowInstanceQuery } from '@/store/api/rfx-approval/workflow.api';
import { useLazyGetGroupQuery } from '@/store/api/rfx-approval/rfx-iam';
import { useAuth } from '@megp/auth';

const perPage = 10;
function calculateTotalPages(totalItems: number, itemsPerPage: number): number {
  if (totalItems <= 0 || itemsPerPage <= 0) {
    return 0;
  }

  return Math.ceil(totalItems / itemsPerPage);
}

export default function Items() {
  const [listById, { data: itemsList, isLoading: isItemsLoading }] =
    useLazyGetItemsForEvaluationQuery();
  const { id } = useParams();
  const { user, userCall } = useAuth();
  const { data: currentStep } = useGetCurrentWorkflowInstanceQuery({
    itemId: id?.toString(),
    key: 'RFQEvaluationApproval',
  });

  const [getGroup, { data: groupData }] = useLazyGetGroupQuery();

  const totalPages = calculateTotalPages(itemsList?.total ?? 0, perPage);
  const [page, setPage] = useState(1);
  const { data } = useContext(StatusContext);

  useEffect(() => {
    const from = (page - 1) * perPage;
    listById({
      collectionQuery: { skip: from, take: perPage },
      id: id.toString(),
    });
  }, [id, page]);

  useEffect(() => {
    if (user) {
      getGroup({ userId: user?.organizations?.[0].userId });
    }
  }, [user]);

  const checkIsApprover = () => {
    return (
      groupData?.items?.some(
        (entry) => entry.groupId === currentStep?.instanceStep?.approvers[0].id,
      ) ||
      userCall?.organizations?.[0]?.roles?.some(
        (role) => role?.id == currentStep?.instanceStep?.approvers?.[0]?.id,
      ) ||
      user?.organizations?.[0].userId ===
        currentStep?.instanceStep?.approvers[0].id
    );
  };

  return (
    <Stack>
      <LoadingOverlay visible={isItemsLoading} />
      {itemsList?.items?.map((item, index) => (
        <Section key={index} title={item.description} defaultCollapsed>
          <Stack className="p-4">
            {checkIsApprover() && (
              <Flex className="gap-2 ml-auto">
                <Button className="bg-green-600">Accept</Button>
                <Button className="bg-red-600">Reject</Button>
              </Flex>
            )}
            <ItemConfiguration id={item?.id} />
            <Box>
              {data?.isOpen ? null : (
                <ItemDetailSpec
                  itemSpec={item?.technicalRequirement?.technicalSpecification}
                />
              )}
            </Box>
            <BidderList bidders={item?.openedOffers} />
          </Stack>
        </Section>
      ))}
      <Group className="mt-2" justify="end">
        <Pagination
          onChange={setPage}
          size="sm"
          total={totalPages}
          value={page}
          withEdges
        />
      </Group>
    </Stack>
  );
}

const BidderList = (bidders: any) => {
  const config = {
    columns: [
      {
        accessor: 'name',
        title: 'Company Name',
        render: (value) => <>{value?.solRegistration?.vendorName}</>,
      },
      {
        accessor: 'price',
        title: 'Price',
        render: (value) => (
          <>
            {' '}
            {value?.price?.toLocaleString('en-US', {
              style: 'currency',
              currency: value?.currency ?? 'MKW',
            })}
          </>
        ),
      },
      {
        accessor: 'qualificationAssessment',
        title: 'Financial Assessment',
        render: (value) => (
          <>
            {value?.qualificationAssessment == 'APPLICABLE'
              ? 'Applicable'
              : 'Not Applicable'}
          </>
        ),
      },
    ],
    isExpandable: false,
    isSearchable: false,
    primaryColumn: 'name',
  };

  return (
    <ExpandableTable
      config={config}
      data={bidders?.bidders ?? []}
      total={bidders?.total ?? 0}
    />
  );
};
