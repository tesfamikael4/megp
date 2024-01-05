import { DetailTable } from './detail-table';

export const DetailPr = ({ cell }: any) => {
  const data = [
    {
      key: 'Reference',
      value: cell.requisitionReferenceNumber,
    },
    {
      key: 'Name',
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
      value: cell?.estimatedAmount?.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
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
