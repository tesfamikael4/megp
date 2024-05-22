import { Stack } from '@mantine/core';
import { Section } from '@megp/core-fe';
import React from 'react';
import BidSubmission from './bid-submission.component';

export default function BiddingProcedure() {
  return (
    <Stack className="w-full">
      <Section title="Submission">
        <BidSubmission />
      </Section>
    </Stack>
  );
}
