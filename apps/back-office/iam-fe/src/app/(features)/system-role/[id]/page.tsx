'use client';
import { Section } from '@megp/core-fe';
import { Stack } from '@mantine/core';
import ViewPermissionModal from '../_components/view-permission';
import { SystemRole } from '../_components/system-role';

export default function RoleDetailPage() {
  return (
    <Stack>
      <Section title="System role detail">
        <SystemRole mode="detail" />
      </Section>
      <ViewPermissionModal />
    </Stack>
  );
}
