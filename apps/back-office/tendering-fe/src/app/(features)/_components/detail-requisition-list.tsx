import { Button, LoadingOverlay, Stack, Text, Box } from '@mantine/core';
import { DataTable } from 'mantine-datatable';
import { useRouter } from 'next/navigation';
import { notify } from '@megp/core-fe';
import ProcurmentMechanism from './procurment-mechanism.component';
import { useCreateMutation } from '../preparation/_api/tender/tender.api';
import { useLazyGetPRDetailQuery } from '../preparation/_api/tender/procurement-requisition.api';
import { useEffect, useState } from 'react';
import { Tender, TenderStatusEnum } from '@/models/tender/tender.model';
import Lot from './lots';

export const DetailRequisition = ({
  id,
  tender,
}: {
  id: any;
  tender?: Tender;
}) => {
  const [trigger, { data: requisition, isLoading: isGettingDetail }] =
    useLazyGetPRDetailQuery();
  const [data, setData] = useState<any[]>([]);
  useEffect(() => {
    if (id) {
      trigger(id);
    }
  }, [id, trigger]);

  useEffect(() => {
    if (requisition) {
      setData([
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
          value: parseInt(requisition.calculatedAmount).toLocaleString(
            'en-US',
            {
              style: 'currency',
              currency: requisition.currency,
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
              currencyDisplay: 'code',
            },
          ),
        },
      ]);
    }
  }, [requisition]);

  const [convert, { isLoading: isConverting }] = useCreateMutation();
  const router = useRouter();

  const onClickPRSelection = async () => {
    try {
      const result = await convert({ prId: requisition?.id }).unwrap();
      if (result) router.push(`/tender/${result?.id}?tab=configuration`);
      notify('Success', 'Converted to Tender successfully.');
    } catch (err) {
      notify('Error', err?.data?.message ?? 'Error while creating Tender.');
    }
  };

  return (
    <Stack className="bg-white p-5" pos="relative">
      <LoadingOverlay visible={isGettingDetail} />
      {((tender && tender.status === TenderStatusEnum.CANCELED) || !tender) && (
        <Button
          className="ml-auto"
          onClick={onClickPRSelection}
          loading={isConverting}
        >
          Convert to Tender
        </Button>
      )}
      <Text className="font-semibold mb-2">Definition</Text>
      {requisition && (
        <>
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
          <ProcurmentMechanism
            procurementMechanisms={requisition.procurementMechanisms}
          />
          {tender && (
            <>
              <Text className="font-semibold mb-2">Lots</Text>

              {tender.lots?.map((lot) => (
                <Box key={lot.id}>
                  <Lot lot={lot} />
                </Box>
              ))}
            </>
          )}
        </>
      )}
    </Stack>
  );
};
