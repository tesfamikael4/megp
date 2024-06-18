import { DetailTable } from './detail-table';

export const DetailItem = ({ data }: any) => {
  const detailData = [
    {
      key: 'Classification',
      value: data?.commodityName,
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
      value: 'MKW',
    },
    // {
    //   key: 'Unit Price',
    //   value: data?.unitPrice?.toLocaleString('en-US', {
    //     style: 'currency',
    //     currency: data?.currency,
    //     minimumFractionDigits: 2,
    //     maximumFractionDigits: 2,
    //   }),
    // },
    {
      key: 'Unit of Measurement',
      value: data?.uOMName,
    },
  ];
  return (
    <>
      <DetailTable data={detailData} />
    </>
  );
};
