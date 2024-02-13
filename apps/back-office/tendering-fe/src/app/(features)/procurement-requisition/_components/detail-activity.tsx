import { Box, Button, Group, Text } from '@mantine/core';
import { DataTable } from 'mantine-datatable';
import { useState } from 'react';

export const DetailActivity = ({
  activity,
  onDetail,
  hideMethods,
  hideIdentifications,
}: {
  hideMethods?: boolean;
  hideIdentifications?: boolean;
  activity: any;
  onDetail?: (record) => void;
}) => {
  const [showMore, setShowMore] = useState(false);
  const activityIdentification = [
    {
      key: 'Reference',
      value: activity.procurementReferenceNumber,
    },
    {
      key: 'Name',
      value: activity.activityName,
    },
    {
      key: 'Description',
      value: activity.description,
    },
    {
      key: 'Estimated Amount',
      value: parseInt(activity.estimatedAmount).toLocaleString('en-US', {
        style: 'currency',
        currency: activity.currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        currencyDisplay: 'code',
      }),
    },
    {
      key: 'Calculated Amount',
      value: parseInt(activity.calculatedAmount).toLocaleString('en-US', {
        style: 'currency',
        currency: activity.currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        currencyDisplay: 'code',
      }),
    },
    { key: 'Remark', value: activity.remark },
  ];
  const procurementMethod = [
    {
      key: 'Procurement Type',
      value: activity.procurementMechanisms.procurementType,
    },
    {
      key: 'Procurement Method',
      value: activity.procurementMechanisms.procurementMethod,
    },
    {
      key: 'Funding Source',
      value: activity.procurementMechanisms.fundingSource,
    },
    {
      key: 'Procurement Process',
      value: activity.procurementMechanisms.isOnline ? 'Online' : 'Offline',
    },
    {
      key: 'Supplier Target Group',
      value: activity.procurementMechanisms.targetGroup.join(', '),
    },
  ];

  return (
    <Box className="bg-white p-5" pos="relative">
      {!hideIdentifications && (
        <>
          {!hideMethods && (
            <Text className="font-semibold mb-2">Identification</Text>
          )}
          <DataTable
            withColumnBorders
            withTableBorder
            records={activityIdentification}
            columns={[
              {
                accessor: 'key',
                width: 200,
                cellsStyle: () => ({
                  background: '#DCE8F2',
                }),
              },
              {
                accessor: 'value',
                cellsStyle: () => ({
                  background: 'white',
                }),
              },
            ]}
            noHeader
          />
        </>
      )}

      {!hideMethods && (
        <>
          {!hideIdentifications && (
            <Text className="font-semibold my-2">Procurement Methods</Text>
          )}
          <DataTable
            withColumnBorders
            withTableBorder
            records={procurementMethod}
            columns={[
              {
                accessor: 'key',
                width: 200,
                cellsStyle: () => ({
                  background: '#DCE8F2',
                }),
              },
              {
                accessor: 'value',
                cellsStyle: () => ({
                  background: 'white',
                }),
              },
            ]}
            noHeader
          />
        </>
      )}
      {showMore && (
        <>
          <Text className="font-semibold my-2">Items</Text>

          <DataTable
            withColumnBorders
            withTableBorder
            records={activity.annualProcurementPlanItems}
            columns={[
              {
                accessor: 'itemCode',
                title: 'Item Code',
                // width: 100,
              },
              { accessor: 'description', title: 'Description' },
              {
                title: 'UoM',
                accessor: 'uoM',
              },
              {
                accessor: 'quantity',
                // width: 100,
              },
              {
                title: 'Unit Price',
                textAlign: 'center',
                accessor: 'unitPrice',
                width: 100,
                render: (record) => {
                  return (
                    <p>
                      {parseInt(record?.unitPrice)?.toLocaleString('en-US', {
                        style: 'currency',
                        currency: record?.currency ? record?.currency : 'USD',
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                        currencyDisplay: 'code',
                      })}
                    </p>
                  );
                },
              },

              {
                title: 'Total',
                accessor: 'total',
                textAlign: 'right',
                width: 150,
                render: (record: any) => (
                  <p className="text-right">
                    {(record.unitPrice * record.quantity).toLocaleString(
                      'en-US',
                      {
                        style: 'currency',
                        currency: record?.currency ? record?.currency : 'USD',
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                        currencyDisplay: 'code',
                      },
                    )}
                  </p>
                ),
              },
            ]}
            defaultColumnProps={{
              titleStyle: () => ({ background: '#DCE8F2' }),
            }}
          />
        </>
      )}

      <Group justify="end" className="mt-2">
        <Button
          className="text-slate-600 cursor-pointer"
          onClick={() => setShowMore((prev) => !prev)}
          variant="subtle"
        >
          {showMore ? 'Show Less' : 'Show More'}
        </Button>
      </Group>
    </Box>
  );
};
