import { Table } from '@mantine/core';
import { DetailTable } from './detail-table';

export const DetailItem = ({ data }: any) => {
  const detailData = [
    {
      key: 'Classification',
      value: `Segment > Famliy > Class > ${data?.metaData?.commodityName} | ${data?.metaData?.commodityCode}`,
    },
    {
      key: 'Item Code',
      value: data.itemCode,
    },
    {
      key: 'Description',
      value: data.description,
    },
    {
      key: 'Unit Price',
      value: data.unitPrice.toLocaleString('en-US', {
        style: 'currency',
        currency: data.currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        currencyDisplay: 'code',
      }),
    },
    {
      key: 'Unit of Measurement',
      value: data.uomName,
    },
  ];
  return (
    <>
      <DetailTable data={detailData} />
    </>
  );
};
