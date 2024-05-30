import { Badge, Box, Text } from '@mantine/core';
import { DetailTable } from '../../_components/detail-table';

export const DetailRequisition = ({ requisition }: { requisition: any }) => {
  const tempMethod =
    requisition.procurementMechanisms !== null
      ? requisition.procurementMechanisms
      : undefined;
  const data = [
    {
      key: 'Reference',
      value: requisition.procurementReference,
    },
    {
      key: 'Optional Reference Number',
      value: requisition.userReference,
    },
    {
      key: 'Title',
      value: requisition.name,
    },
    {
      key: 'Description',
      value: requisition.description,
    },
    {
      key: 'Estimated Amount',
      value: parseFloat(requisition.estimatedAmount).toLocaleString('en-US', {
        style: 'currency',
        currency: requisition.currency ?? 'MKW',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        currencyDisplay: 'code',
      }),
    },
    {
      key: 'Calculated Amount',
      value: parseInt(requisition.calculatedAmount).toLocaleString('en-US', {
        style: 'currency',
        currency: requisition.currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        currencyDisplay: 'code',
      }),
    },
    { key: 'Multi Year', value: requisition.isMultiYear ? 'Yes' : 'No' },
    { key: 'Remark', value: requisition.remark },
  ];

  const methodsConfig = tempMethod
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

  return (
    <Box className="bg-white p-5" pos="relative">
      <Text className="font-semibold mb-2">Definition</Text>

      <DetailTable data={data} />
      {methodsConfig.length !== 0 && (
        <>
          <Text className="font-semibold my-2">Procurement Method</Text>

          <DetailTable data={methodsConfig} />
        </>
      )}
    </Box>
  );
};
