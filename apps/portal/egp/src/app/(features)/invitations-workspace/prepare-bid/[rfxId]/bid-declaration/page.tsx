import { Box, Stack } from '@mantine/core';
import React from 'react';
import DocumentaryEvidence from '../../_components/bid-declaration/documentary-evidence.component';

export default function BidDeclarationPage() {
  return (
    <Stack className="my-2">
      <Box>
        <DocumentaryEvidence />
      </Box>
    </Stack>
  );
}
