import { Box, LoadingOverlay, Table, Text } from '@mantine/core';
import { DataTable } from 'mantine-datatable';
import { useLazyListByIdQuery } from '../_api/pre-mechanism';
import { useEffect, useState } from 'react';
import { useLazyListByIdQuery as useLazyListPostByIdQuery } from '../_api/post-mechanism';

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
  const activityId = activity.id;
  const [methods, setMethods] = useState<any[]>([]);
  const data = [
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

  // const isMounted = useIsMounted();

  //rtk
  const [
    getPreMechanism,
    {
      data: preMechanism,
      isLoading: isGetPreMechanismLoading,
      isSuccess: isGetPreMechanismSuccess,
    },
  ] = useLazyListByIdQuery();

  const [
    getPostMechanism,
    {
      data: postMechanism,
      isLoading: isGetPostMechanismLoading,
      isSuccess: isGetPostMechanismSuccess,
    },
  ] = useLazyListPostByIdQuery();

  //use effect
  useEffect(() => {
    if (page == 'pre') {
      getPreMechanism({
        id: activityId,
        collectionQuery: undefined,
      });
    } else if (page == 'post') {
      getPostMechanism({
        id: activityId,
        collectionQuery: undefined,
      });
    }
  }, []);

  useEffect(() => {
    if (page == 'pre' && isGetPreMechanismSuccess && preMechanism?.total != 0) {
      const temp = preMechanism?.items[0];
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
    } else if (
      page == 'post' &&
      isGetPostMechanismSuccess &&
      postMechanism?.total != 0
    ) {
      const temp = postMechanism?.items[0];
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
  }, [isGetPreMechanismSuccess, preMechanism]);
  return (
    <Box className="bg-white p-5" pos="relative">
      <LoadingOverlay
        visible={isGetPreMechanismLoading || isGetPostMechanismLoading}
      />
      {!hideActivity && (
        <>
          <Text className="font-semibold mb-2">Identification</Text>
          <DataTable
            withColumnBorders
            withTableBorder
            records={data}
            columns={[{ accessor: 'key', width: 200 }, { accessor: 'value' }]}
            noHeader
          />
        </>
      )}
      {methods.length !== 0 && !hideMethods && (
        <>
          <Text className="font-semibold my-2">Procurement Methods</Text>
          <DataTable
            withColumnBorders
            withTableBorder
            records={methods}
            columns={[{ accessor: 'key', width: 200 }, { accessor: 'value' }]}
            noHeader
          />
        </>
      )}
    </Box>
  );
};
