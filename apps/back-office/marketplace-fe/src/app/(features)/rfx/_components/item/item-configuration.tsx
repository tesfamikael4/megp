import { useReadQuery } from '../../_api/rfx/items.api';
import { useParams } from 'next/navigation';
import { DetailTable } from '../detail-table';
import { LoadingOverlay, Stack } from '@mantine/core';

export default function ItemConfiguration() {
  const { itemId } = useParams();
  const { data: item, isLoading: isGettingItemDetail } = useReadQuery(
    itemId?.toString(),
  );
  const generalDescription = [
    {
      key: 'Name',
      value: item?.name,
    },
    {
      key: 'Description',
      value: item?.description,
    },
    {
      key: 'Item Code',
      value: item?.itemCode,
    },
    {
      key: 'Item Type',
      value: item?.itemType,
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
      key: 'Estimated Price',
      value: `${item?.estimatedPrice} ${item?.estimatedPriceCurrency}`,
    },
    {
      key: 'Market Price',
      value: `${item?.marketPrice} ${item?.marketPriceCurrency}`,
    },
    {
      key: 'has Bill of quantity',
      value: `${item?.marketPrice}`,
    },
  ];

  return (
    <Stack className="bg-white p-4">
      <LoadingOverlay visible={isGettingItemDetail} />
      <DetailTable data={generalDescription} />
    </Stack>
  );
}
