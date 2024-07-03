import { useReadQuery } from '../../_api/rfx/items.api';
import { useParams } from 'next/navigation';
import { DetailTable } from '../detail-table';
import { LoadingOverlay, Stack } from '@mantine/core';

export default function ItemConfiguration({ id }: { id?: string }) {
  const { itemId } = useParams();
  const { data: item, isLoading: isGettingItemDetail } = useReadQuery(
    id ? id : itemId?.toString(),
  );
  const generalDescription = [
    {
      key: 'Description',
      value: item?.description,
    },
    {
      key: 'Item Code',
      value: item?.itemCode,
    },
    {
      key: 'Quantity',
      value: item?.quantity,
    },
    {
      key: 'Unit of measure',
      value: item?.unitOfMeasure,
    },
    {
      key: 'Unit Price',
      value: `${item?.estimatedPriceCurrency} ${item?.estimatedPrice}`,
    },
    {
      key: 'Calculated Amount',
      value: `${(parseInt(item?.estimatedPrice ?? 0) * item?.quantity).toLocaleString('en-US', { style: 'currency', currency: item?.estimatedPriceCurrency ?? 'MKW' })}`,
    },
    // {
    //   key: 'Market Price',
    //   value: `${item?.marketPrice} ${item?.marketPriceCurrency}`,
    // },
    // {
    //   key: 'has Bill of quantity',
    //   value: `${item?.marketPrice}`,
    // },
  ];

  return (
    <Stack className="bg-white">
      <LoadingOverlay visible={isGettingItemDetail} />
      <DetailTable data={generalDescription} />
    </Stack>
  );
}
