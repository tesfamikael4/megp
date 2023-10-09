'use client';
import { Section } from '@megp/core-fe';
import { FormDetail } from '../_components/form-detail';
import AddEntityModal from '../_components/userAssignment';
import { Stack } from '@mantine/core';
import AddRole from '../_components/add-role';

export default function UserDetailPage() {
  return (
    <Stack>
      <Section title="User Detail">
        <FormDetail mode="detail" />
      </Section>
      <AddEntityModal />
      <AddRole />
    </Stack>
  );
}
