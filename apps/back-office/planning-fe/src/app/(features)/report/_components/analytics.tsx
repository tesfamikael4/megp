'use client';

import { Box, Flex, Group, LoadingOverlay, Text } from '@mantine/core';
import { TargetGroupCard } from './target-group-card';
import { BarChart, PieChart } from '@mantine/charts';
import { useLazyGetPostBudgetPlanReportQuery } from '@/store/api/post-budget-plan/post-budget-plan.api';
import { useEffect } from 'react';

export const Analytics = ({
  planYearId,
}: {
  planYearId: string | null | undefined;
}) => {
  const [getReports, { data, isLoading }] =
    useLazyGetPostBudgetPlanReportQuery();

  useEffect(() => {
    if (planYearId) getReports(planYearId);
  }, [getReports, planYearId]);
  return (
    <Box className="bg-white p-5" pos="relative">
      <LoadingOverlay visible={isLoading} />
      <Text className="font-semibold mb-3">Supplier Target</Text>
      <Flex gap={6}>
        <TargetGroupCard
          label="IBM"
          value={data?.targetGroups?.percentages?.IBM.percentage}
        />
        <TargetGroupCard
          label="Marginalized Group"
          value={
            data?.targetGroups?.percentages?.['MSM Enterprises'].percentage
          }
        />
        <TargetGroupCard
          label="MSME"
          value={
            data?.targetGroups?.percentages?.['Marginalized Group'].percentage
          }
        />
        <TargetGroupCard
          label="Others"
          value={data?.targetGroups?.percentages?.Others.percentage}
        />
      </Flex>

      {/* pie chart */}
      <Flex gap={10}>
        <Box className="w-fit p-8 rounded border mt-4 w-full">
          <Text className="font-semibold mb-6">
            Activities By Procurement Type
          </Text>
          <PieChart
            labelsPosition="inside"
            withLabels
            withTooltip
            tooltipDataSource="segment"
            strokeWidth={2}
            mx="auto"
            data={[
              {
                name: 'Goods',
                value: data?.procurementType?.percentages?.Goods.count,
                color: 'indigo.6',
              },
              {
                name: 'Works',
                value: data?.procurementType?.percentages?.Works.count,
                color: 'yellow.6',
              },
              {
                name: 'Non Consulting Services',
                value:
                  data?.procurementType?.percentages?.[
                    'Non Consulting Services'
                  ].count,
                color: 'teal.6',
              },
              {
                name: 'Consultancy Services',
                value:
                  data?.procurementType?.percentages?.['Consultancy Services']
                    .count,
                color: 'gray.6',
              },
              {
                name: 'Motor Vehicle Repair',
                value:
                  data?.procurementType?.percentages?.['Motor Vehicle Repair']
                    .count,
                color: 'red.6',
              },
            ]}
          />
          <Flex gap={6}>
            <Box>
              <Group gap={3}>
                <p className="text-indigo-600 text-3xl">•</p>
                <p>Goods</p>
              </Group>
              <Group gap={3}>
                <p className="text-yellow-400 text-3xl">•</p>
                <p>Works</p>
              </Group>
            </Box>
            <Box>
              <Group gap={3}>
                <p className="text-teal-600 text-3xl">•</p>
                <p>Non Consulting Services</p>
              </Group>
              <Group gap={3}>
                <p className="text-gray-600 text-3xl">•</p>
                <p>Consultancy Services</p>
              </Group>
            </Box>
          </Flex>

          <Group gap={3}>
            <p className="text-red-600 text-3xl">•</p>
            <p>Motor Vehicle Repair</p>
          </Group>
        </Box>

        {/* procurement process */}
        <Box className="w-fit p-8 rounded border mt-4 w-full">
          <Text className="font-semibold mb-6">
            Activities By Procurement Process
          </Text>
          <PieChart
            labelsPosition="inside"
            withLabels
            withTooltip
            tooltipDataSource="segment"
            strokeWidth={2}
            mx="auto"
            data={[
              {
                name: 'Online',
                value: data?.isOnline?.percentages?.true.count,
                color: 'indigo.6',
              },
              {
                name: 'Offline',
                value: data?.isOnline?.percentages?.false.count,
                color: 'gray.6',
              },
            ]}
          />
          <Flex justify="space-around" mt={10}>
            <Group gap={3}>
              <p className="text-indigo-600 text-3xl">•</p>
              <p>Online</p>
            </Group>

            <Group gap={3}>
              <p className="text-gray-600 text-3xl">•</p>
              <p>Offline</p>
            </Group>
          </Flex>
        </Box>
        {/* Funding source */}
        <Box className="w-fit p-8 rounded border mt-4 w-full">
          <Text className="font-semibold mb-6">
            Activities By Funding Source
          </Text>
          <PieChart
            labelsPosition="inside"
            withLabels
            withTooltip
            tooltipDataSource="segment"
            strokeWidth={2}
            mx="auto"
            data={[
              {
                name: 'Treasury',
                value: data?.fundingSources?.percentages?.Treasury.count,
                color: 'indigo.6',
              },
              {
                name: 'Internal Revenue',
                value:
                  data?.fundingSources?.percentages?.['Internal Revenue'].count,
                color: 'yellow.6',
              },
              {
                name: 'Loan',
                value: data?.fundingSources?.percentages?.Loan.count,
                color: 'teal.6',
              },
              {
                name: 'Donor',
                value: data?.fundingSources?.percentages?.Donor.count,
                color: 'gray.6',
              },
            ]}
          />
          <Flex justify="space-around" mt={10}>
            <Box>
              <Group gap={3}>
                <p className="text-indigo-600 text-3xl">•</p>
                <p>Treasury</p>
              </Group>

              <Group gap={3}>
                <p className="text-teal-600 text-3xl">•</p>
                <p>Loan</p>
              </Group>
            </Box>
            <Box>
              <Group gap={3}>
                <p className="text-yellow-400 text-3xl">•</p>
                <p>Internal Revenue</p>
              </Group>

              <Group gap={3}>
                <p className="text-gray-600 text-3xl">•</p>
                <p>Donor</p>
              </Group>
            </Box>
          </Flex>
        </Box>
      </Flex>

      {/* bar chart */}
      <Box className="mt-10 p-8 border rounded">
        <Text className="font-semibold mb-6">
          Activities By Procurement Method
        </Text>
        <BarChart
          h={400}
          data={[
            {
              method: 'RFQ',
              activities:
                data?.procurementMethods?.percentages?.[
                  'Request for Quotation (RFQ)'
                ].count,
            },
            {
              method: 'NCB',
              activities:
                data?.procurementMethods?.percentages?.[
                  'National Competitive Bidding (NCB)'
                ].count,
            },
            {
              method: 'ICB',
              activities:
                data?.procurementMethods?.percentages?.[
                  'International Competitive Bidding (ICB)'
                ].count,
            },
            {
              method: 'Restricted Tender',
              activities:
                data?.procurementMethods?.percentages?.['Restricted Tender']
                  .count,
            },
            {
              method: 'Single Source',
              activities:
                data?.procurementMethods?.percentages?.[
                  'Single Source Procurement'
                ].count,
            },
            {
              method: 'RFP',
              activities:
                data?.procurementMethods?.percentages?.[
                  'Request for Proposal (RFP)'
                ].count,
            },
            {
              method: 'Two Stage Bidding',
              activities:
                data?.procurementMethods?.percentages?.['Two Stage Bidding']
                  .count,
            },
            {
              method: 'Framework',
              activities:
                data?.procurementMethods?.percentages?.['Framework Procurement']
                  .count,
            },
            {
              method: 'Call off',
              activities:
                data?.procurementMethods?.percentages?.[
                  'Purchased Orders (Call off)'
                ].count,
            },
          ]}
          dataKey="method"
          series={[
            { name: 'activities', color: 'indigo.6', label: 'Activity' },
          ]}
        />
      </Box>
    </Box>
  );
};
