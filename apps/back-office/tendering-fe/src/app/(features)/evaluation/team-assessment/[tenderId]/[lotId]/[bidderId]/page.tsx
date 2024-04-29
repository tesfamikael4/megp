'use client';

import { BidderOverView } from '@/app/(features)/opening/[tenderId]/bidders/_components/bidder-overview';
import { Box, Flex } from '@mantine/core';
import { Section } from '@megp/core-fe';
import { Checklist } from './_components/checklist';
import { ChecklistAssessment } from './_components/assesment';

export default function BiderDetail() {
  return (
    <>
      <BidderOverView />
      <Flex gap={10} mt={10}>
        <Box className=" bg-white w-1/4">
          <Checklist />
        </Box>
        <Box className=" bg-white w-2/4">
          <Section
            title="The Bid Opening Team has opened each bid"
            collapsible={false}
            className="h-full overflow-scroll"
          >
            <embed
              src={'https://arxiv.org/pdf/1708.08021.pdf'}
              type="application/pdf"
              width="100%"
              height="400px"
            />
          </Section>
        </Box>
        <Box className=" bg-white w-1/4">
          <ChecklistAssessment />
        </Box>
      </Flex>
    </>
  );
}
