import { Box, Button } from '@mantine/core';
import { Section } from '@megp/core-fe';
import { FormDetail } from '../_components/form-detail';
import { IconPlus } from '@tabler/icons-react';

export default function NewItems() {
  return (
    <Box>
      <Section title="Add Items">
        <FormDetail mode="new" />
      </Section>
    </Box>
  );
}
