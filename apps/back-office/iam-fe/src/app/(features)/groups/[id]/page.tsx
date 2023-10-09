'use client';
import { Stack } from '@mantine/core';
import { Section } from '@megp/core-fe';
import { FormDetail } from '../_components/form-detail';

import AddUserModal from '../_components/user-assignment';

export default function GroupPage() {
  return (
    <Stack>
      <Section title="Group Detail">
        <FormDetail mode="detail" />
      </Section>
      <AddUserModal />
    </Stack>
  );
}
