'use client';

import { Box, Button, Menu, Text } from '@mantine/core';
import { DetailActivity } from '../../../(app)/_components/detail-activity';
import {
  IconChevronRight,
  IconFileExport,
  IconPrinter,
} from '@tabler/icons-react';
import { DataTable } from 'mantine-datatable';

export const ReportCard = ({ reports }: any) => {
  // const {data:plan}
  return (
    <Box>
      <Menu shadow="md">
        <Menu.Target>
          <Button
            rightSection={<IconChevronRight size={14} />}
            className="mb-2"
          >
            Actions
          </Button>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item leftSection={<IconFileExport size={14} />}>
            Export
          </Menu.Item>
          <Menu.Item
            leftSection={<IconPrinter size={14} />}
            onClick={() => window.print()}
          >
            Print
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
      <Box className="p-5 border rounded" id="printableArea">
        <Text className="mb-5 font-semibold text-lg text-center">
          Annual Procurement Plan 2023
        </Text>
        {reports.map((report) => (
          <Box key={report.id}>
            <Text className="font-semibold text-lg px-2 py-1 bg-slate-300 mt-2">
              {report.name}
            </Text>
            <DetailActivity
              activity={report}
              page="post"
              hideMethods={!report.postProcurementMechanisms}
            />

            {/* items */}
            {report.postBudgetPlanItems && (
              <Box className="px-5">
                <Text className="font-semibold text-lg mb-2">Items</Text>
                <DataTable
                  records={report.postBudgetPlanItems}
                  columns={[
                    { accessor: 'description' },
                    { accessor: 'quantity', width: 200 },
                    {
                      accessor: 'unitPrice',
                      textAlign: 'center',
                      render: (record) => (
                        <p className="text-right">
                          {parseFloat(record.unitPrice).toLocaleString(
                            'en-US',
                            {
                              style: 'currency',
                              currency: report.currency,
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                              currencyDisplay: 'code',
                            },
                          )}
                        </p>
                      ),
                      width: 200,
                    },
                  ]}
                  withTableBorder
                  withColumnBorders
                  striped
                  noRecordsText="No Item Found"
                  highlightOnHover
                  minHeight={200}
                />
              </Box>
            )}

            {/* timeline */}
            {report.postBudgetPlanTimelines && (
              <Box className="px-5">
                <Text className="font-semibold text-lg mb-2">Timeline</Text>
                <DataTable
                  records={report.postBudgetPlanTimelines}
                  columns={[
                    { accessor: 'timeline', title: 'Name' },
                    { accessor: 'period', width: 200 },
                    {
                      accessor: 'dueDate',
                      render: (record) => (
                        <p>
                          {new Date(record.dueDate).toLocaleDateString(
                            'en-US',
                            {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            },
                          )}
                        </p>
                      ),
                    },
                  ]}
                  withTableBorder
                  withColumnBorders
                  striped
                  noRecordsText="No Item Found"
                  highlightOnHover
                  minHeight={200}
                />
              </Box>
            )}

            {/* requisitioner */}
            {report.postBudgetRequisitioners && (
              <Box className="px-5">
                <Text className="font-semibold text-lg mb-2">
                  Requisitioners
                </Text>
                <DataTable
                  records={report.postBudgetRequisitioners}
                  columns={[{ accessor: 'name' }]}
                  withTableBorder
                  withColumnBorders
                  striped
                  noRecordsText="No Requisitioner Assigned"
                  highlightOnHover
                  minHeight={200}
                />
              </Box>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
};
