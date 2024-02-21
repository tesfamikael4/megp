'use client';

import {
  Box,
  Button,
  Checkbox,
  Flex,
  Group,
  LoadingOverlay,
  Menu,
  Modal,
  Text,
} from '@mantine/core';
import { useLazyListByIdQuery } from '../../(app)/post-budget-plan/[budgetYear]/activities/_api/activities.api';
import { useEffect, useState } from 'react';
import { ExpandableTable } from '../../_components/expandable-table';
import { IconChevronRight, IconReportAnalytics } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
// import { ReportCard } from './report';
import { Filter } from './filter';
import { PdfReport } from './pdf-tamplate';

export const CustomReport = ({
  planYearId,
}: {
  planYearId: string | null | undefined;
}) => {
  const [selectedItems, setSelectedItems] = useState<any>([]);
  const [include, setInclude] = useState<string[]>([]);
  const [generateModalOpened, { open, close }] = useDisclosure(false);
  const [getActivities, { data: activities, isLoading: isActivitiesLoading }] =
    useLazyListByIdQuery();
  const [getReports, { data: reports, isLoading: isReportLoading }] =
    useLazyListByIdQuery();

  const config = {
    isSelectable: true,
    isSearchable: true,
    selectedItems,
    setSelectedItems,
    columns: [
      {
        accessor: 'name',
        sortable: true,
      },
      {
        accessor: 'estimatedAmount',
        textAlign: 'right',
        width: 200,
        sortable: true,
        render: (record) => (
          <p className="text-right">
            {parseInt(record.estimatedAmount).toLocaleString('en-US', {
              style: 'currency',
              currency: record.currency,
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
              currencyDisplay: 'code',
            })}
          </p>
        ),
      },
    ],

    action: (
      <Flex justify="space-between" className="w-full mr-2">
        <Menu shadow="md">
          <Menu.Target>
            <Button
              rightSection={<IconChevronRight size={14} />}
              disabled={selectedItems.length === 0}
            >
              Actions
            </Button>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              leftSection={<IconReportAnalytics size={14} />}
              onClick={open}
            >
              Generate Report
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
        <Filter />
      </Flex>
    ),
  };

  const onGenerateReport = () => {
    // const castedId = selectedItems.map((item) => item.id as string);
    close();
    setInclude([]);
    getReports({
      id: planYearId as string,
      collectionQuery: {
        includes: include,
        // where: [[{ column: 'id', operator: 'IN', value: castedId }]],
      },
    });
  };

  useEffect(() => {
    if (planYearId) {
      getActivities({
        id: planYearId,
        collectionQuery: {},
      });
    }
  }, [getActivities, planYearId]);

  return (
    <Box className="bg-white p-5" mih={300} pos="relative">
      <LoadingOverlay visible={isActivitiesLoading || isReportLoading} />
      {reports?.items ? (
        // <ReportCard reports={reports?.items} />
        <PdfReport activities={reports?.items} />
      ) : (
        <ExpandableTable config={config} data={activities?.items ?? []} />
      )}
      <Modal
        opened={generateModalOpened}
        onClose={close}
        title="Generate Report"
      >
        <Text>Which section will be generated?</Text>
        <Checkbox
          label="Procurement Method"
          className="mt-2"
          checked={include.includes('postProcurementMechanisms')}
          onChange={(e) => {
            if (include.includes('postProcurementMechanisms')) {
              setInclude(
                include.filter((i) => i !== 'postProcurementMechanisms'),
              );
            } else {
              setInclude([...include, 'postProcurementMechanisms']);
            }
          }}
        />
        <Checkbox
          label="Items"
          className="mt-2"
          checked={include.includes('postBudgetPlanItems')}
          onChange={(e) => {
            if (include.includes('postBudgetPlanItems')) {
              setInclude(include.filter((i) => i !== 'postBudgetPlanItems'));
            } else {
              setInclude([...include, 'postBudgetPlanItems']);
            }
          }}
        />
        <Checkbox
          label="Timeline"
          className="mt-2"
          onChange={(e) => {
            if (include.includes('postBudgetPlanTimelines')) {
              setInclude(
                include.filter((i) => i !== 'postBudgetPlanTimelines'),
              );
            } else {
              setInclude([...include, 'postBudgetPlanTimelines']);
            }
          }}
        />
        <Checkbox
          label="Requisitioners"
          className="mt-2"
          onChange={(e) => {
            if (include.includes('postBudgetRequisitioners')) {
              setInclude(
                include.filter((i) => i !== 'postBudgetRequisitioners'),
              );
            } else {
              setInclude([...include, 'postBudgetRequisitioners']);
            }
          }}
        />

        <Group justify="end">
          <Button onClick={onGenerateReport}>Generate</Button>
        </Group>
      </Modal>
    </Box>
  );
};
