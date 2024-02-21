'use client';
import { Box, ComboboxData, Flex, LoadingOverlay, Select } from '@mantine/core';
import { Section } from '@megp/core-fe';

import { Analytics } from './_components/analytics';
import { useEffect, useState } from 'react';
import { CustomReport } from './_components/custom-report';
import { useGetPostBudgetPlansQuery } from '@/store/api/post-budget-plan/post-budget-plan.api';

export default function ReportPage() {
  const [reportType, setReportType] = useState<string | null>('analytics');
  const [selectedBudgetYear, setSelectedBudgetYear] = useState<string | null>();
  const {
    data: postBudgetPlan,
    isLoading: isPostBudgetPlanLoading,
    isSuccess: isPostBudgetPlanSuccess,
  } = useGetPostBudgetPlansQuery({});
  const [budgetYears, setBudgetYears] = useState<ComboboxData | undefined>([]);

  useEffect(() => {
    if (isPostBudgetPlanSuccess && postBudgetPlan) {
      const temp = postBudgetPlan.items.map((item) => {
        return { value: item.id, label: item.app.planName };
      });
      setBudgetYears(temp);
      setSelectedBudgetYear(temp[0].value);
    }
  }, [isPostBudgetPlanSuccess, postBudgetPlan]);
  return (
    <Section title="Report and Analytics" collapsible={false}>
      <Box pos="relative">
        <LoadingOverlay visible={isPostBudgetPlanLoading} />

        <Flex justify="space-between">
          <Select
            placeholder="Select Procurement Plan"
            className="w-1/3 mb-3"
            label="Budget Year"
            value={selectedBudgetYear}
            onChange={setSelectedBudgetYear}
            data={budgetYears}
          />
          <Select
            placeholder="Report Type"
            className="w-1/4 mb-3"
            label="Report Type"
            value={reportType}
            onChange={setReportType}
            data={[
              { label: 'Analytics', value: 'analytics' },
              { label: 'Custom Report', value: 'customReport' },
              { label: 'Budget Report', value: 'budgetReport' },
            ]}
          />
        </Flex>

        {isPostBudgetPlanSuccess && reportType === 'analytics' && (
          <Analytics planYearId={selectedBudgetYear} />
        )}
        {isPostBudgetPlanSuccess && reportType === 'customReport' && (
          <CustomReport planYearId={selectedBudgetYear} />
        )}
      </Box>
    </Section>
  );
}
