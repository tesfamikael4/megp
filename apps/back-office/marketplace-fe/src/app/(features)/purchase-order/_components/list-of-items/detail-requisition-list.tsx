import { Button, Stack, Text } from '@mantine/core';
import { DataTable } from 'mantine-datatable';

// import { useCreateMutation } from '../_api/rfx/rfx.api';
import { useRouter } from 'next/navigation';
import { logger, notify } from '@megp/core-fe';
// import ProcurmentMechanism from './procurment-mechanism.component';
import { DetailTable } from './detail-table';

export const DetailRequisition = ({ award }: { award: any }) => {
  const definitionConfig = [
    {
      key: 'name',
      value: award.name,
    },
    {
      key: 'Reference Number',
      value: award.procurementReferenceNumber,
    },
    {
      key: 'budgetAmount',
      value: award.budgetAmount,
    },
  ];

  const router = useRouter();
  return (
    <Stack className="bg-white p-5" pos="relative">
      <Button
        className="ml-auto"
        onClick={() => router.push(`/purchase-order/choose-award/${award?.id}`)}
        // loading={isConverting}
      >
        Choose Award
      </Button>
      <Text className="font-semibold mb-2">Definition</Text>
      <DetailTable data={definitionConfig} />
      {/* <Text className="font-semibold mb-2">Procurment Mechanism</Text> */}
      {/* <ProcurmentMechanism id={requisition?.id} /> */}
    </Stack>
  );
};
