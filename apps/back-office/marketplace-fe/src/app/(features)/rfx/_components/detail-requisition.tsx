import { DetailTable } from './detail-table';

export const DetailPr = ({ cell }: any) => {
  const data = [
    {
      key: 'Reference',
      value: cell.procurementReference,
    },
    {
      key: 'Title',
      value: cell.name,
    },
    {
      key: 'Description',
      value: cell.description,
    },

    {
      key: 'Currency',
      value: cell.currency,
    },

    {
      key: 'Total Calculated Amount',
      value: cell?.calculatedAmount?.toLocaleString('en-US', {
        style: 'currency',
        currency: cell.currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    },
  ];
  return (
    <>
      <DetailTable data={data} />
    </>
  );
};
