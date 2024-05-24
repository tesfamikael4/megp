import { Button, Stack, Text } from '@mantine/core';
import { DataTable } from 'mantine-datatable';

import { useCreateMutation } from '../_api/rfx/rfx.api';
import { useRouter } from 'next/navigation';
import { logger, notify } from '@megp/core-fe';
import ProcurmentMechanism from './procurment-mechanism.component';

export const DetailRequisition = ({ requisition }: { requisition: any }) => {
  const data = [
    {
      key: 'Reference',
      value: requisition.procurementReference,
      titleStyle: (theme) => ({ color: theme.colors.green[6] }),
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
      <DataTable
        withColumnBorders
        withTableBorder
        records={data}
        striped={false}
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
      <Text className="font-semibold mb-2">Procurment Mechanism</Text>
      <ProcurmentMechanism id={requisition?.id} />
    </Stack>
  );
};
