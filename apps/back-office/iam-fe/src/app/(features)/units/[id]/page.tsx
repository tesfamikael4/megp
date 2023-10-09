'use client';
import { Section } from '@megp/core-fe';
import { FormDetail } from '../_components/form-detail';
import AddUserModal from '../_components/user-assignment';
import { Stack } from '@mantine/core';

export default function UnitDetailPage() {
  return (
    <Stack>
      <Section title="Unit Detail">
        <FormDetail mode="detail" />
      </Section>
      <AddUserModal />
    </Stack>
  );
}
