import { Table } from '@mantine/core';
import { DetailTable } from './detail-table';
import { logger } from '@megp/core-fe';

export const DetailItem = ({ data }: any) => {
  logger.log(data);
  const detailData = [
    {
      key: 'Classification',
      // value: `Segment > Famliy > Class > ${data?.metaData?.commodityName} | ${data?.metaData?.commodityCode}`,
      value: data?.classification,
    },
    {
      key: 'Item Code',
      value: data?.itemCode,
    },
    {
      key: 'Description',
      value: data?.description,
    },
    {
      key: 'Currency',
      value: data?.currency,
    },
    {
      key: 'Unit Price',
      value: data?.unitPrice.toLocaleString('en-US', {
        style: 'currency',
        currency: data.currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    },
    {
      key: 'Unit of Measurement',
      value: data?.uoM,
    },
  ];
  return (
    <>
      <DetailTable data={detailData} />
    </>
  );
};
