import { Section } from '@megp/core-fe';
import React from 'react';
import Qualification from './qualification.component';
import { Stack } from '@mantine/core';
import DocumentaryEvidence from './documentery-evidence/documentary-evidence';

export default function EvaluationCriteria() {
  return (
    <Stack className="w-full">
      <Qualification />
      <DocumentaryEvidence />
    </Stack>
  );
}
