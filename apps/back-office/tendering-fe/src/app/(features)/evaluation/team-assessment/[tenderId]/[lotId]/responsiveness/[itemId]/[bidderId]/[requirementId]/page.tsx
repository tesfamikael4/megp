'use client';
import { Box, Flex } from '@mantine/core';
import { PreviewDocument } from '@/app/(features)/evaluation/_components/preview-submitted-document';
import { ComplianceAssessment } from '@/app/(features)/evaluation/_components/compliance';

export default function ChecklistDetail() {
  return (
    <Flex gap={10}>
      <Box className=" bg-white w-2/3">
        <PreviewDocument milestone="technicalResponsiveness" teamAssessment />
      </Box>
      <Box className=" bg-white w-1/3">
        <ComplianceAssessment
          milestone="technicalResponsiveness"
          teamAssessment
        />
      </Box>
    </Flex>
  );
}
