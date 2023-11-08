'use client';
import { Section } from '@megp/core-fe';
import { FormDetail } from '../_components/form-detail';
import { Stack } from '@mantine/core';
import AddUserModal from '../_components/add-permission';

export default function RoleDetailPage() {
  return (
    <Stack>
      <Section title="Role detail">
        <FormDetail mode="detail" />
      </Section>
      <AddUserModal />
    </Stack>
  );
}
