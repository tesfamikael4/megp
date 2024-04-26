import { Badge, Box, Text } from '@mantine/core';
import { DetailTable } from '../../_components/detail-table';

export const DetailActivity = ({
  hideActivity = false,
  hideMethods = false,
  activity,
  page,
}: {
  activity: any;
  page: 'pre' | 'post';
  hideActivity?: boolean;
  hideMethods?: boolean;
}) => {
  const tempMethod =
    page === 'pre'
      ? activity.preProcurementMechanism !== null
        ? activity.preProcurementMechanism
        : undefined
      : activity.postProcurementMechanisms !== null
        ? activity.postProcurementMechanism
        : undefined;
  const methods = tempMethod
    ? [
        {
          key: 'Procurement Type',
          value: tempMethod.procurementType,
        },
        {
          key: 'Procurement Method',
          value: tempMethod.procurementMethod,
        },
        {
          key: 'Funding Source',
          value: tempMethod.fundingSource,
        },
        {
          key: 'Procurement Process',
          value: tempMethod.isOnline ? (
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
          value: tempMethod.targetGroup.join(', '),
        },
        {
          key: 'Donor',
          value: tempMethod.donor[0] ?? '',
        },
      ]
    : [];

  const data = [
    {
      key: 'Reference',
      value: activity.procurementReference,
    },
    {
      key: 'Optional Reference Number',
      value: activity.userReference,
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
      value: parseFloat(activity.estimatedAmount).toLocaleString('en-US', {
        style: 'currency',
        currency: activity.currency ?? 'MKW',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        currencyDisplay: 'code',
      }),
    },
    {
      key: 'Calculated Amount',
      value: parseFloat(activity.calculatedAmount).toLocaleString('en-US', {
        style: 'currency',
        currency: activity.currency ?? 'MKW',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        currencyDisplay: 'code',
      }),
    },
    { key: 'Remark', value: activity.remark },
  ];

  return (
    <Box className="bg-white p-5" pos="relative">
      {!hideActivity && (
        <>
          <Text className="font-semibold mb-2">Activity Identification</Text>
          <DetailTable data={data} />
        </>
      )}
      {methods.length !== 0 && !hideMethods && (
        <>
          <Text className="font-semibold my-2">Procurement Methods</Text>
          <DetailTable data={methods} />
        </>
      )}
    </Box>
  );
};
