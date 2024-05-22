'use client';

import React from 'react';
import { Container } from '@mantine/core';
import StatsPage from './_components/Stats';
import VendorListPage from './_components/VendorsList';

const VendorsList = ({
  stats,
  vendors,
}: {
  stats: React.ReactNode;
  vendors: React.ReactNode;
}) => {
  return (
    <Container size={'xl'}>
      <StatsPage />
      <VendorListPage />
    </Container>
  );
};

export default VendorsList;
