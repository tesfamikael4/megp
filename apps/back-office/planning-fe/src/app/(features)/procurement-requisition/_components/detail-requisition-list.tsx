import { Box, LoadingOverlay, Text, rgba } from '@mantine/core';
import { DataTable } from 'mantine-datatable';

import { useEffect, useState } from 'react';
import { useLazyListByIdQuery } from '../_api/mechanization.api';

export const DetailRequisition = ({ requisition }: { requisition: any }) => {
  const requisitionId = requisition.id;
  const [methods, setMethods] = useState<any[]>([]);
  const data = [
    {
      key: 'Reference',
      value: requisition.requisitionReferenceNumber,
      titleStyle: (theme) => ({ color: theme.colors.green[6] }),
    },
    {
      key: 'Title',
      value: requisition.title,
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

  // const isMounted = useIsMounted();

  //rtk
  const [
    getMechanism,
    {
      data: mechanism,
      isLoading: isGetMechanismLoading,
      isSuccess: isGetMechanismSuccess,
    },
  ] = useLazyListByIdQuery();

  //use effect
  useEffect(() => {
    getMechanism({
      id: requisitionId,
      collectionQuery: undefined,
    });
  }, [getMechanism, requisitionId]);

  useEffect(() => {
    if (isGetMechanismSuccess && mechanism?.total != 0) {
      const temp = mechanism?.items[0];
      setMethods([
        {
          key: 'Procurement Type',
          value: temp.procurementType,
        },
        {
          key: 'Procurement Method',
          value: temp.procurementMethod,
        },
        {
          key: 'Funding Source',
          value: temp.fundingSource,
        },
        {
          key: 'Procurement Process',
          value: temp.isOnline ? 'Online' : 'Offline',
        },
        {
          key: 'Supplier Target Group',
          value: temp.targetGroup.join(', '),
        },
      ]);
    }
  }, [isGetMechanismSuccess, mechanism]);
  return (
    <Box className="bg-white p-5" pos="relative">
      <LoadingOverlay visible={isGetMechanismLoading} />
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
      {methods.length !== 0 && (
        <>
          <Text className="font-semibold my-2">Procurement Method</Text>
          <DataTable
            withColumnBorders
            withTableBorder
            records={methods}
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
    </Box>
  );
};
