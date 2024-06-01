import { Badge, Box, Button, Group, Text } from '@mantine/core';
import { DataTable } from 'mantine-datatable';
import { useState } from 'react';
import { DetailTable } from '../../_components/detail-table';
import { logger } from '@megp/core-fe';

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
      value: activity.procurementReference,
    },
    {
      key: 'Name',
      value: activity.name,
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
      value: activity.postProcurementMechanism?.procurementType,
    },
    {
      key: 'Procurement Method',
      value: activity.postProcurementMechanism?.procurementMethod,
    },
    {
      key: 'Funding Source',
      value: activity.postProcurementMechanism?.fundingSource,
    },
    {
      key: 'Procurement Process',
      value: activity.postProcurementMechanism?.isOnline ? (
        <Badge color="green" size="xs">
          Online
        </Badge>
      ) : (
        <Badge color="red" size="xs">
          Offline
        </Badge>
      ),
    },
    {
      key: 'Supplier Target Group',
      value: activity.postProcurementMechanism?.targetGroup?.join(', '),
    },
  ];

  return (
    <Box className="bg-white p-5" pos="relative">
      {!hideIdentifications && (
        <>
          {!hideMethods && (
            <Text className="font-semibold mb-2">Identification</Text>
          )}
          <Box className="bg-white p-5" pos="relative">
            <Text className="font-semibold mb-2">Definition</Text>

            <DetailTable data={activityIdentification} />
          </Box>
        </>
      )}

      {!hideMethods && (
        <>
          {!hideIdentifications && (
            <>
              <Text className="font-semibold my-2">Procurement Methods</Text>
              <DetailTable data={procurementMethod} />
            </>
          )}
        </>
      )}
      {showMore && (
        <>
          <Text className="font-semibold my-2">Items</Text>

          <DataTable
            withColumnBorders
            withTableBorder
            records={activity.postBudgetPlanItems}
            columns={[
              {
                accessor: 'itemCode',
                title: 'Item Code',
                // width: 100,
              },
              { accessor: 'description', title: 'Description' },
              {
                title: 'UoM',
                accessor: 'uomName',
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
