'use client';
import { useLazyGetDifDetailQuery } from '@/store/api/post-budget-plan/post-budget-plan.api';
import { Box, Flex, LoadingOverlay } from '@mantine/core';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { CustomTable } from './custom-table';
import { ExpandableTable, ExpandableTableConfig } from '@megp/core-fe';

export const Compare = ({ activityId }: { activityId: string }) => {
  const { toBeCompare, comparedWith } = useParams();
  const [getDiff, { isLoading, data }] = useLazyGetDifDetailQuery();
  const config: ExpandableTableConfig = {
    columns: [
      { accessor: 'description' },
      { accessor: 'quantity' },
      { accessor: 'unitPrice' },
    ],
    minHeight: 100,
  };

  const timelineConfig: ExpandableTableConfig = {
    columns: [
      {
        accessor: 'timeline',
        title: 'Name',
      },
      {
        accessor: 'period',
        title: 'Number Of Days',
      },
      {
        accessor: 'dueDate',
        render: (record) =>
          new Date(record.dueDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          }),
      },
    ],
  };

  const requisitionerConfig: ExpandableTableConfig = {
    minHeight: 100,
    columns: [
      {
        accessor: 'name',
      },
    ],
  };

  useEffect(() => {
    getDiff({ toBeCompare, comparedWith, activityId });
  }, [activityId, comparedWith, getDiff, toBeCompare]);
  return (
    <Box className="p-5" pos="relative">
      <LoadingOverlay visible={isLoading} />

      {/* title */}
      <Flex gap={10}>
        <p className="font-semibold text-xl w-full">To be Compare</p>
        <p className="font-semibold text-xl w-full">Compare With</p>
      </Flex>

      {/* activity Identification */}
      <Flex gap={10}>
        <Box className="w-full">
          <p className="my-2 font-semibold">Activity Identification</p>
          <CustomTable
            toBeCompare
            modifiedKeys={data?.modifiedKeys}
            data={[
              {
                title: 'Name',
                key: 'name',
                value: data?.modifiedToCompare?.name ?? '',
              },
              {
                title: 'Description',
                key: 'description',
                value: data?.modifiedToCompare?.description ?? '',
              },
              {
                title: 'Estimated Amount',
                key: 'estimatedAmount',
                value: data?.modifiedToCompare?.estimatedAmount ?? '',
              },
              {
                title: 'Reference',
                key: 'reference',
                value: data?.modifiedToCompare?.procurementReference ?? '',
              },
              {
                title: 'Remark',
                key: 'remark',
                value: data?.modifiedToCompare?.remark ?? '',
              },
            ]}
          />
        </Box>
        <Box className="w-full">
          <p className="my-2 font-semibold">Activity Identification</p>
          <CustomTable
            modifiedKeys={data?.modifiedKeys}
            data={[
              {
                key: 'name',
                title: 'Name',
                value: data?.modifiedCompareWith?.name ?? '',
              },
              {
                title: 'Description',
                key: 'description',
                value: data?.modifiedCompareWith?.description ?? '',
              },
              {
                title: 'Estimated Amount',
                key: 'estimatedAmount',
                value: data?.modifiedCompareWith?.estimatedAmount ?? '',
              },
              {
                title: 'Reference',
                key: 'reference',
                value: data?.modifiedCompareWith?.procurementReference ?? '',
              },
              {
                title: 'Remark',
                key: 'remark',
                value: data?.modifiedCompareWith?.remark ?? '',
              },
            ]}
          />
        </Box>
      </Flex>

      {/* activity Mechanization */}
      <Flex gap={10}>
        <Box className="w-full">
          <p className="my-2 font-semibold">Activity Mechanization</p>
          <CustomTable
            toBeCompare
            modifiedKeys={data?.modifiedKeys}
            data={[
              {
                key: 'postProcurementMechanism.procurementType',
                title: 'Procurement Type',
                value:
                  data?.modifiedToCompare?.postProcurementMechanism
                    ?.procurementType ?? '',
              },
              {
                key: 'postProcurementMechanism.procurementMethod',
                title: 'Procurement Method',
                value:
                  data?.modifiedToCompare?.postProcurementMechanism
                    ?.procurementMethod ?? '',
              },
              {
                key: 'postProcurementMechanism.fundingSource',
                title: 'Funding Source',
                value:
                  data?.modifiedToCompare?.postProcurementMechanism
                    ?.fundingSource ?? '',
              },
              {
                key: 'postProcurementMechanism.isOnline',
                title: 'Procurement Process',
                value: data?.modifiedToCompare?.postProcurementMechanism
                  ?.isOnline
                  ? 'Online'
                  : 'Offline' ?? '',
              },
              {
                key: 'postProcurementMechanism.targetGroup',
                title: 'Supplier Target Group',
                value:
                  data?.modifiedToCompare?.postProcurementMechanism?.targetGroup.join(
                    ',',
                  ) ?? '',
              },
            ]}
          />
        </Box>
        <Box className="w-full">
          <p className="my-2 font-semibold">Activity Mechanization</p>
          <CustomTable
            modifiedKeys={data?.modifiedKeys}
            data={[
              {
                key: 'postProcurementMechanism.procurementType',
                title: 'Procurement Type',
                value:
                  data?.modifiedCompareWith?.postProcurementMechanism
                    ?.procurementType ?? '',
              },
              {
                key: 'postProcurementMechanism.procurementMethod',
                title: 'Procurement Method',
                value:
                  data?.modifiedCompareWith?.postProcurementMechanism
                    ?.procurementMethod ?? '',
              },
              {
                key: 'postProcurementMechanism.fundingSource',
                title: 'Funding Source',
                value:
                  data?.modifiedCompareWith?.postProcurementMechanism
                    ?.fundingSource ?? '',
              },
              {
                key: 'postProcurementMechanism.isOnline',
                title: 'Procurement Process',
                value: data?.modifiedCompareWith?.postProcurementMechanism
                  ?.isOnline
                  ? 'Online'
                  : 'Offline' ?? '',
              },
              {
                key: 'postProcurementMechanism.targetGroup',
                title: 'Supplier Target Group',
                value:
                  data?.modifiedCompareWith?.postProcurementMechanism?.targetGroup.join(
                    ',',
                  ) ?? '',
              },
            ]}
          />
        </Box>
      </Flex>

      {/*Items*/}
      <Flex gap={10}>
        <Box className="w-full">
          <p className="my-2 font-semibold">Activity Items </p>
          <ExpandableTable
            data={data?.modifiedToCompare?.postBudgetPlanItems ?? []}
            config={config}
          />
        </Box>
        <Box className="w-full">
          <p className="my-2 font-semibold">Activity Items </p>
          <ExpandableTable
            data={data?.modifiedCompareWith?.postBudgetPlanItems ?? []}
            config={config}
          />
        </Box>
      </Flex>

      {/*Timeline*/}
      <Flex gap={10}>
        <Box className="w-full">
          <p className="my-2 font-semibold">Activity Timeline </p>
          <ExpandableTable
            data={data?.modifiedToCompare?.postBudgetPlanTimelines ?? []}
            config={timelineConfig}
          />
        </Box>
        <Box className="w-full">
          <p className="my-2 font-semibold">Activity Timeline </p>
          <ExpandableTable
            data={data?.modifiedCompareWith?.postBudgetPlanTimelines ?? []}
            config={timelineConfig}
          />
        </Box>
      </Flex>

      {/*requisitioner*/}
      <Flex gap={10}>
        <Box className="w-full">
          <p className="my-2 font-semibold">Activity Requisitioner </p>
          <ExpandableTable
            data={data?.modifiedToCompare?.postBudgetRequisitioners ?? []}
            config={requisitionerConfig}
          />
        </Box>
        <Box className="w-full">
          <p className="my-2 font-semibold">Activity Requisitioner </p>
          <ExpandableTable
            data={data?.modifiedCompareWith?.postBudgetRequisitioners ?? []}
            config={requisitionerConfig}
          />
        </Box>
      </Flex>
    </Box>
  );
};
