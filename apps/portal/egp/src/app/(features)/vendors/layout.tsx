'use client';

import React from 'react';
import Entity from './_components/Entity';
import { Container } from '@mantine/core';

const VendorsList = ({ children }: { children: React.ReactNode }) => {
  return (
    <Container size={'xl'}>
      <Entity>{children}</Entity>
    </Container>
  );
};

export default VendorsList;
