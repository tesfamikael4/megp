'use client';

import { Box } from '@mantine/core';
import React from 'react';
import { Categories } from './categories-list';
import { useDisclosure } from '@mantine/hooks';

function Page() {
  const [isSidebarOpen] = useDisclosure(false);
  return <Box></Box>;
}

export default Page;
