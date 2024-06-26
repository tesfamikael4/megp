import { logger } from '@megp/core-fe';
import { DetailTable } from './detail-table';

export const DetailItem = ({ data }: any) => {
  logger.log(data);
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
