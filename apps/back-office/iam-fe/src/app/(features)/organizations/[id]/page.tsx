'use client';
import { Section } from '@megp/core-fe';
import { FormDetail } from '../_components/form-detail';
import AddEntityModal from '../_components/add-mandate';
import { Stack } from '@mantine/core';
import AddOa from '../_components/Invitation';

export default function OrganizationPage() {
  return (
    <Stack>
      <Section title="Organization Detail">
        <FormDetail mode="detail" />
      </Section>
      <AddEntityModal />
      <AddOa />
    </Stack>
  );
}
