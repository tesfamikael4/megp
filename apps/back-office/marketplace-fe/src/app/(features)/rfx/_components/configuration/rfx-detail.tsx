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
      key: 'Procurment Referance',
      value: rfx?.procurementReferenceNo,
    },
    {
      key: 'Budget Amount',
      value: rfx?.budgetAmount,
    },
    {
      key: 'Budget Amount Currency',
      value: rfx?.budgetAmountCurrency,
    },
  ];
  return <DetailTable data={rfxDetail} />;
}
