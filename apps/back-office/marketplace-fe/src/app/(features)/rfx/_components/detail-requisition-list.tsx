import { Button, Stack, Text } from '@mantine/core';
import { DataTable } from 'mantine-datatable';

import { useCreateMutation } from '../_api/rfx/rfx.api';
import { useRouter } from 'next/navigation';
import { logger, notify } from '@megp/core-fe';
import ProcurmentMechanism from './procurment-mechanism.component';
import { DetailTable } from './detail-table';

export const DetailRequisition = ({ requisition }: { requisition: any }) => {
  const definitionConfig = [
    {
      key: 'Reference',
      value: requisition.procurementReference,
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
      key: 'Calculated Amount',
      value: parseInt(requisition.calculatedAmount).toLocaleString('en-US', {
        style: 'currency',
        currency: requisition.currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        currencyDisplay: 'code',
      }),
    },
  ];
  const [convert, { isLoading: isConverting }] = useCreateMutation();
  const router = useRouter();

  const onClickPRSelection = async () => {
    try {
      const result = await convert({ prId: requisition?.id }).unwrap();
      if (result) router.push(`/rfx/${result?.id}/configuration`);
      notify('Success', 'Converted to RFQ successfully.');
    } catch (err) {
      notify('Error', err?.data?.message ?? 'Error while creating RFQ.');
    }
  };

  return (
    <Stack className="bg-white p-5" pos="relative">
      <Button
        className="ml-auto"
        onClick={onClickPRSelection}
        loading={isConverting}
      >
        Convert to RFQ
      </Button>
      <Text className="font-semibold mb-2">Definition</Text>
      <DetailTable data={definitionConfig} />
      <Text className="font-semibold mb-2">Procurment Mechanism</Text>
      <ProcurmentMechanism id={requisition?.id} />
    </Stack>
  );
};
