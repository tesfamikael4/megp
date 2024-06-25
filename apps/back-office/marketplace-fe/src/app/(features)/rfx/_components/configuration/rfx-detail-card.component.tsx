'use client';
import React from 'react';
import { useReadQuery } from '../../_api/rfx/rfx.api';
import { useParams } from 'next/navigation';
import { DetailTable } from '../detail-table';
import { Section } from '@megp/core-fe';
import { Box } from '@mantine/core';

export default function RFXDetailCard() {
  const { id } = useParams();
  const { data: selectedRFX } = useReadQuery(id?.toString());
  const rfxDetail = [
    {
      key: 'Name',
      value: selectedRFX?.name,
    },
    {
      key: 'Description',
      value: selectedRFX?.description,
    },
    {
      key: 'Procurement Reference',
      value: selectedRFX?.procurementReferenceNumber,
    },
    {
      key: 'Budget Amount',
      value: `${selectedRFX?.budgetAmountCurrency} ${selectedRFX?.budgetAmount?.toLocaleString(
        'en-US',
        {
          style: 'currency',
          currency: selectedRFX?.budgetAmountCurrency,
        },
      )}`,
    },
  ];
  return (
    <Section title="RFQ Detail" collapsible={true} defaultCollapsed>
      <Box className="w-full">
        <DetailTable data={rfxDetail} />
      </Box>
    </Section>
  );
}
