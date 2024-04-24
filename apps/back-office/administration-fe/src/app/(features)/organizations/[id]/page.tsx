'use client';
import { Stack } from '@mantine/core';
import { Section } from '@megp/core-fe';
import { FormDetail } from '../_components/form-detail';
import AddEntityModal from '../_components/add-budget-category';
export default function OrganizationsDetailPage() {
  return (
    <Stack>
      <Section title="Organazation Detail">
        <FormDetail />
      </Section>
      <AddEntityModal />
    </Stack>
  );
}
