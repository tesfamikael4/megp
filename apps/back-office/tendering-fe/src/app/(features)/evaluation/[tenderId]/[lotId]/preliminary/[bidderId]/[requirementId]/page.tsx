'use client';
import { Box, Flex } from '@mantine/core';
import { ComplianceAssessment } from '@/app/(features)/evaluation/_components/compliance';
import { PreviewDocument } from '@/app/(features)/evaluation/_components/preview-submitted-document';

export default function ChecklistDetail() {
  return (
    <Flex gap={10}>
      <Box className=" bg-white w-2/3">
        <PreviewDocument milestone="technicalCompliance" />
      </Box>
      <Box className=" bg-white w-1/3">
        <ComplianceAssessment milestone="technicalCompliance" />
      </Box>
    </Flex>
  );
}
