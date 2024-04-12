'use client';

import { Box } from '@mantine/core';

export const WorkFlowLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box>
      <Box className="mb-2">{children}</Box>
    </Box>
  );
};
