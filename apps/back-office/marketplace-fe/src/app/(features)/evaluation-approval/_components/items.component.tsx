'use client';
import {
  Box,
  Button,
  Flex,
  Group,
  LoadingOverlay,
  Menu,
  Pagination,
  Stack,
  Timeline,
} from '@mantine/core';
import { ExpandableTable, Section } from '@megp/core-fe';
import { useContext, useEffect, useState } from 'react';
import ItemConfiguration from '../../rfx/_components/item/item-configuration';
import { useParams } from 'next/navigation';
import { ItemDetailSpec } from '../../evaluation/_component/item-specification.component';
import { StatusContext } from '@/contexts/rfx-status.context';
import {
  useAdjustItemResponseMutation,
  useGiveItemResponseMutation,
  useLazyGetItemsForEvaluationQuery,
  useLazyGetMyLatestEvaluationQuery,
  useLazyGetPreviousEvluationHistoryQuery,
} from '@/store/api/rfx/eval-approval.api';
import { useGetCurrentWorkflowInstanceQuery } from '@/store/api/rfx-approval/workflow.api';
import { useLazyGetGroupQuery } from '@/store/api/rfx-approval/rfx-iam';
import { useAuth } from '@megp/auth';
import { IconCircleCheck, IconCircleX, IconHistory } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { timeAgo } from './time-ago-convert.component';

const perPage = 10;
function calculateTotalPages(totalItems: number, itemsPerPage: number): number {
  if (totalItems <= 0 || itemsPerPage <= 0) {
    return 0;
  }

  return Math.ceil(totalItems / itemsPerPage);
}

export default function Items({ isComplete }: { isComplete: boolean }) {
  const { id } = useParams();
  const [listById, { data: itemsList, isLoading: isItemsLoading }] =
    useLazyGetItemsForEvaluationQuery();
  const [
    getPreviousHistory,
    { data: previousHistory, isLoading: isGettingHistory },
  ] = useLazyGetPreviousEvluationHistoryQuery();

  const totalPages = calculateTotalPages(itemsList?.total ?? 0, perPage);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const from = (page - 1) * perPage;
    listById({
      collectionQuery: { skip: from, take: perPage },
      id: id.toString(),
    });
  }, [id, page]);

  return (
    <Stack>
      <LoadingOverlay visible={isItemsLoading} />
      {itemsList?.items?.map((item, index) => (
        <Section
          title={item.description}
          defaultCollapsed
          key={index}
          action={
            <Menu shadow="md" width={400} position="left-start">
              <Menu.Target>
                <IconHistory
                  color="gray"
                  className="cursor-pointer"
                  onClick={() =>
                    getPreviousHistory({
                      itemId: item?.id,
                    })
                  }
                />
              </Menu.Target>
              <Menu.Dropdown>
                <Box className="p-4">
                  <LoadingOverlay visible={isGettingHistory} />
                  <Timeline
                    active={previousHistory?.length - 1}
                    bulletSize={24}
                    lineWidth={2}
                  >
                    {previousHistory?.map((history) => (
                      <Timeline.Item
                        key={history?.id}
                        bullet={
                          history?.status == 'APPROVE' ? (
                            <IconCircleCheck size={12} />
                          ) : (
                            <IconCircleX size={12} color="red" />
                          )
                        }
                        title={history?.workflowItem?.approverName ?? 'Bek PA'}
                      >
                        <p className="text-sm text-gray-400">
                          {history?.status}
                        </p>
                        <p className="mt-4 text-xs">
                          {timeAgo(new Date(history?.workflowItem?.updatedAt))}
                        </p>
                      </Timeline.Item>
                    ))}
                  </Timeline>
                </Box>
              </Menu.Dropdown>
            </Menu>
          }
        >
          <ItemBody key={index} item={item} isComplete={isComplete} />
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

const ItemBody = ({ item, isComplete }: any) => {
  const { id } = useParams();
  const { user, userCall } = useAuth();

  const { data: currentStep } = useGetCurrentWorkflowInstanceQuery({
    itemId: id?.toString(),
    key: 'RFQEvaluationApproval',
  });
  const [acceptItem, { isLoading: isAccepting }] =
    useGiveItemResponseMutation();
  const [rejectItem, { isLoading: isRejecting }] =
    useGiveItemResponseMutation();
  const [adjustResponse, { isLoading: isAdjusting }] =
    useAdjustItemResponseMutation();

  const [
    getMyLatestEvaluation,
    { data: myLatestResponse, isLoading: isGettingMyResponse },
  ] = useLazyGetMyLatestEvaluationQuery();

  const [getGroup, { data: groupData }] = useLazyGetGroupQuery();

  const { data } = useContext(StatusContext);

  useEffect(() => {
    getMyLatestEvaluation({
      itemId: item?.id?.toString(),
      step: currentStep?.instanceStep?.order,
    });
  }, [item?.id]);

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
  const handleSubmitResponse = async (response: {
    status: 'ACCEPT' | 'REJECT';
    itemId: string;
  }) => {
    try {
      if (response?.status == 'ACCEPT' && !myLatestResponse?.status)
        await acceptItem({
          objectId: id.toString(),
          itemId: response?.itemId,
          status: 'APPROVE',
          step: currentStep?.instanceStep?.order,
        }).unwrap();
      else if (response?.status == 'ACCEPT' && myLatestResponse?.status)
        await adjustResponse({
          id: myLatestResponse?.id,
          objectId: id.toString(),
          itemId: response?.itemId,
          status: 'APPROVE',
          step: currentStep?.instanceStep?.order,
        }).unwrap();
      else if (response?.status == 'REJECT' && !myLatestResponse?.status)
        await rejectItem({
          objectId: id.toString(),
          itemId: response?.itemId,
          status: 'REJECT',
          step: currentStep?.instanceStep?.order,
        }).unwrap();
      else if (response?.status == 'REJECT' && myLatestResponse?.status)
        await adjustResponse({
          id: myLatestResponse?.id,
          objectId: id.toString(),
          itemId: response?.itemId,
          status: 'REJECT',
          step: currentStep?.instanceStep?.order,
        }).unwrap();
      notifications.show({
        title: 'Success',
        message: 'Response submitted successfully',
        color: 'green',
      });
    } catch (err: any) {
      notifications.show({
        title: 'Error',
        message: err.message,
        color: 'red',
      });
    }
  };

  return (
    <Stack className="p-4">
      {checkIsApprover() && (
        <Stack>
          <LoadingOverlay visible={isGettingMyResponse} />
          {myLatestResponse?.status && (
            <p className="ml-auto">
              {myLatestResponse?.status == 'APPROVE' ? 'APPROVED' : 'REJECTED'}
            </p>
          )}
          <Flex className="gap-2 ml-auto">
            {myLatestResponse?.status != 'APPROVE' && !isComplete && (
              <Button
                className="bg-green-600"
                loading={isAccepting || isAdjusting}
                onClick={async () =>
                  await handleSubmitResponse({
                    status: 'ACCEPT',
                    itemId: item?.id,
                  })
                }
              >
                Accept
              </Button>
            )}
            {myLatestResponse?.status != 'REJECT' && !isComplete && (
              <Button
                className="bg-red-600"
                loading={isRejecting || isAdjusting}
                onClick={async () =>
                  await handleSubmitResponse({
                    status: 'REJECT',
                    itemId: item?.id,
                  })
                }
              >
                Reject
              </Button>
            )}
          </Flex>
        </Stack>
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
  );
};
