import { Table } from '@mantine/core';
import { DetailTable } from './detail-table';

export const DetailActivity = ({ cell }: any) => {
  const data = [
    {
      key: 'Reference',
      value: cell.procurementReference,
    },
    {
      key: 'Name',
      value: cell.name,
    },
    {
      key: 'Description',
      value: cell.description,
    },
    // {
    //   key: 'Method',
    //   value: cell.procurementMethod,
    // },
    // {
    //   key: 'Type',
    //   value: cell.procurementType,
    // },
    // {
    //   key: 'Funding Source',
    //   value: cell.fundingSource,
    // },
    // {
    //   key: 'Supplier Target Group',
    //   value: cell.preference,
    // },
    {
      key: 'Total Estimated Amount',
      value: parseInt(cell.estimatedAmount).toLocaleString('en-US', {
        style: 'currency',
        currency: cell.currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        currencyDisplay: 'code',
      }),
    },
    {
      key: 'Total Calculated Amount',
      value: parseInt(cell.calculatedAmount).toLocaleString('en-US', {
        style: 'currency',
        currency: cell.currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        currencyDisplay: 'code',
      }),
    },
    { key: 'Remark', value: cell.remark },
  ];
  return (
    <>
      <DetailTable data={data} />
    </>
  );
};
