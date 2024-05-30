'use client';

import React, { JSXElementConstructor, ReactElement } from 'react';
import { Container } from '@mantine/core';
import StatsPage from './_components/Stats';
import VendorListPage from './_components/VendorsList';

const VendorsList = ({
  children,
}: {
  children: ReactElement<any, string | JSXElementConstructor<any>>;
}) => {
  return (
    <Container size={'xl'} className="mt-4">
      <StatsPage />
      <VendorListPage>{children}</VendorListPage>
    </Container>
  );
};

export default VendorsList;
