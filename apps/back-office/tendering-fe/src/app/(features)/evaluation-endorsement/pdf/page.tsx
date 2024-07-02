'use client';

import { Box } from '@mantine/core';

import { PdfTemplate } from './pdf-template';

export default function PDFTemplate() {
  return (
    <Box className="w-full h-full">
      <h1>Technical Endorsement Template</h1>
      <PdfTemplate />
    </Box>
  );
}
