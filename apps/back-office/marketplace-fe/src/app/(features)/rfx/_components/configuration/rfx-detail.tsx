import React from 'react';
import { DetailTable } from '../detail-table';

export default function RFXDetail({ rfx }: any) {
  const rfxDetail = [
    {
      key: 'Name',
      value: rfx?.name,
    },
    {
      key: 'Description',
      value: rfx?.description,
    },
    {
      key: 'Procurment Reference',
      value: rfx?.procurementReferenceNumber,
    },
    {
      key: 'Budget Amount',
      value: `${rfx?.budgetAmountCurrency} ${rfx?.budgetAmount}`,
    },
  ];
  return <DetailTable data={rfxDetail} />;
}
