import { Button } from '@mantine/core';
import { Section } from '@megp/core-fe';
import { IconGardenCart } from '@tabler/icons-react';
import { FormDetail } from '../_components/form-detail';

export default function NewActivity() {
  return (
    <>
      <Section title="New">
        <FormDetail mode="new" />
      </Section>
    </>
  );
}
