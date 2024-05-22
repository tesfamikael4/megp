'use client';
import { Stack } from '@mantine/core';
import React from 'react';
import RFXDetailCard from './rfx-detail-card.component';
import ProcurmentMechanism from '../procurment-mechanism.component';
import { useParams } from 'next/navigation';
import { Section } from '@megp/core-fe';

export default function RFXConfiguration() {
  const { id } = useParams();
  return (
    <Stack className="w-full">
      <RFXDetailCard />
      <Section title="Procurment Mechanism" defaultCollapsed>
        <ProcurmentMechanism id={id.toString()} />
      </Section>
    </Stack>
  );
}
