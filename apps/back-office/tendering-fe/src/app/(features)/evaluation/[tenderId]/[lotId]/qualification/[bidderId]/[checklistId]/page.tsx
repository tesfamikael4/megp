import { Box, Flex } from '@mantine/core';
import { Section } from '@megp/core-fe';
import { ChecklistAssessment } from '../_components/assesment';

export default function ChecklistDetail() {
  return (
    <Flex gap={10}>
      <Box className=" bg-white w-2/3">
        <Section
          title="The Bid Opening Team has opened each bid "
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
      <Box className=" bg-white w-1/3">
        <ChecklistAssessment />
      </Box>
    </Flex>
  );
}
