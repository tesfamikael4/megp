import { Box, Flex, Group } from '@mantine/core';
import { Section } from '@megp/core-fe';
import ViewImage from './view-image';
import CatalogForm from './catalog-form';

export default function ReadSpec() {
  return (
    <>
      <Section collapsible={false}>
        <Box mih={'80vh'}>
          <Flex gap={'sm'}>
            <Box className="w-1/3">
              <ViewImage />
            </Box>
            <Box className="w-2/3">
              <CatalogForm mode={'detail'} />
            </Box>
          </Flex>
        </Box>
      </Section>
    </>
  );
}
